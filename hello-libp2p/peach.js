"use strict";
/* eslint-disable no-console */

const PeerId = require("peer-id");
const PeerInfo = require("peer-info");
const Node = require("./libp2p_bundle");
const pull = require("pull-stream");
const Pushable = require("pull-pushable");
const p = Pushable();
const chalk = require("chalk");
const emoji = require("node-emoji");

const multiaddr = require("multiaddr");
const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");

// allow multiple independent streams of communication across one network connection
const Multiplex = require("libp2p-mplex");

// peer encryption
const SECIO = require("libp2p-secio");

// for finding peers in network without hardcoding
const MulticastDNS = require("libp2p-mdns");

const createNode = async () => {
    const peerInfo = await PeerInfo.create();

    peerInfo.multiaddrs.add("/ip4/127.0.0.1/tcp/0");
    const node = await Libp2p.create({
        peerInfo,
        modules: {
            transport: [TCP],
            streamMuxer: [Multiplex],
            connEncryption: [SECIO],
            peerDiscovery: [MulticastDNS]
        },
        config: {
            peerDiscovery: {
                mdns: {
                    interval: 20e3,
                    enabled: true
                }
            }
        }
    });

    await node.start();
    return node;
};

const handleStart = async node => {
    console.log("node has started (true/false):", node.isStarted());
    console.log(chalk.red.bold("Listening on:"));

    const knownPeers = [];
    const peerInfo = node.peerInfo;

    node.peerInfo.multiaddrs.forEach(ma =>
        console.log(
            "  " +
                ma.toString() +
                "/p2p/" +
                chalk.blue(peerInfo.id.toB58String())
        )
    );

    // when someone finds me
    node.on("peer:connect", peerInfo => {
        console.log(
            "  Someone found me!",
            chalk.blue(`on: ${peerInfo.id.toB58String()}`)
        );
        console.log(
            "\n" + emoji.get("moon"),
            chalk.green(" Waiting for message... ")
        );
    });

    // when someone proposes to me
    node.handle("/propose/1.0.0", (protocol, conn) => {
        // link p pushable, to this connection
        pull(p, conn);

        // handle data from earth
        pull(
            conn,
            pull.map(data => {
                return data.toString("utf8").replace("\n", "");
            }),
            pull.drain(data => {
                if (data == "Proposal") {
                    console.log("Proposal received");
                    accept();
                } else if (data == "done") {
                    console.log("Invest done!");
                } else {
                    console.log("Invalid response XXX");
                }
            })
        );

        function accept() {
            const data = "Accept";
            p.push(data);
        }
    });

    // when I find someone - add them to my known list
    node.on("peer:discovery", peerInfo => {
        console.log(
            "  I found someone!",
            chalk.blue(` on: ${peerInfo.id.toB58String()}`)
        );
        knownPeers.push(peerInfo);
    });

    setTimeout(proposeToAll, 1000, node, knownPeers);
};

const proposeToAll = async (node, knownPeers) => {
    console.log(chalk.red.bold("Proposing to All "));
    knownPeers.forEach(async peer => {
        let result = await propose(node, peer);
        console.log("hello");
        console.log(result);
    });
};

const propose = async (node, peer) => {
    console.log(`  dialing to ${peer.id.toB58String()}`);
    peer.multiaddrs.add("/ip4/127.0.0.1/tcp/10333");
    return new Promise((resolve, reject) => {
        console.log("hello");
        node.dialProtocol(peer, "/propose/1.0.0", (err, conn) => {
            if (err) {
                throw err;
            }
            console.log(
                chalk.blue(
                    " dialed successfuly on protocol: " +
                        chalk.blue("/propose/1.0.0")
                )
            );

            // Write operation. Data sent as a buffer"
            pull(p, conn);
            // Sink, data converted from buffer to utf8 string
            pull(
                conn,
                pull.map(data => {
                    return data.toString("utf8").replace("\n", "");
                }),
                pull.drain(async data => {
                    // gotta check sender
                    if (data == "Accept") {
                        console.log("... Proposal Accepted");
                        await invest();
                    } else if (data == "Reject") {
                        console.log("... Proposal Rejected");
                    } else {
                        console.log("Invalid response XXX");
                    }
                })
            );

            function invest() {
                console.log("....... i n v e s t i n g .......");
                const data = "done";
                p.push(data);
            }

            process.stdin.setEncoding("utf8");
            process.openStdin().on("data", chunk => {
                var data = chunk.toString();
                data = "Proposal";
                console.log("Sending Proposal...");
                p.push(data);
            });

            resolve("result");
        });
    });
    console.log("after dial");
};
// main
(async () => {
    const node = await createNode();
    await handleStart(node);
})();

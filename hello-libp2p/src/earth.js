"use strict";
/* eslint-disable no-console */

const PeerId = require("peer-id");
const PeerInfo = require("peer-info");
const Node = require("./libp2p_bundle");
const pull = require("pull-stream");
const async = require("async");
const chalk = require("chalk");
const emoji = require("node-emoji");
const Pushable = require("pull-pushable");
const p = Pushable();
let moonPeerId;

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

const hello = await createNode();
async.parallel(
    [
        callback => {
            PeerId.createFromJSON(
                require("./ids/earthId"),
                (err, earthPeerId) => {
                    if (err) {
                        throw err;
                    }
                    callback(null, earthPeerId);
                }
            );
        },
        callback => {
            PeerId.createFromJSON(
                require("./ids/moonId"),
                (err, moonPeerId) => {
                    if (err) {
                        throw err;
                    }
                    callback(null, moonPeerId);
                }
            );
        }
    ],
    (err, ids) => {
        if (err) throw err;
        const earthPeerInfo = new PeerInfo(ids[0]);
        earthPeerInfo.multiaddrs.add("/ip4/127.0.0.1/tcp/0");
        const nodeDialer = new Node({ peerInfo: earthPeerInfo });

        const moonPeerInfo = new PeerInfo(ids[1]);
        moonPeerId = ids[1];
        moonPeerInfo.multiaddrs.add("/ip4/127.0.0.1/tcp/10333");
        nodeDialer.start(err => {
            if (err) {
                throw err;
            }

            console.log(
                emoji.get("large_blue_circle"),
                chalk.blue(" Earth Ready "),
                emoji.get("headphones"),
                chalk.blue(" Listening on: ")
            );

            nodeDialer.dialProtocol(
                moonPeerInfo,
                "/propose/1.0.0",
                (err, conn) => {
                    if (err) {
                        throw err;
                    }
                    console.log(
                        "\n" + emoji.get("large_blue_circle"),
                        chalk.blue(
                            " Earth dialed to Moon on protocol: /propose/1.0.0"
                        )
                    );

                    // Write operation. Data sent as a buffer
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
                }
            );
        });
    }
);

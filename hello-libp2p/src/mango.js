"use strict";
/* eslint-disable no-console */

const PeerId = require("peer-id");
const PeerInfo = require("peer-info");
const pull = require("pull-stream");
const Pushable = require("pull-pushable");
const p = Pushable();
const chalk = require("chalk");
const pipe = require("it-pipe");
const lp = require("it-length-prefixed");

const multiaddr = require("multiaddr");
const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");

// allow multiple independent streams of communication across one network connection
const Multiplex = require("libp2p-mplex");

// peer encryption
const SECIO = require("libp2p-secio");

// for finding peers in network without hardcoding
const MulticastDNS = require("libp2p-mdns");

var SimpleHashTable = require("simple-hashtable");
var hashtable = new SimpleHashTable();

const { stdinToStream, streamToConsole } = require("./stream");
const { invest, payback } = require("./dai");

const PRIVATE_KEY =
    "c43157decd59dc8a29ade4a219ee3ce61672eb3c32f27810a1dca59e7c7661ae";

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
    console.log("node has started (true/false):", node.isStarted());
    console.log(chalk.red.bold("Listening on:"));
    node.peerInfo.multiaddrs.forEach(ma =>
        console.log(
            "  " +
                ma.toString() +
                "/p2p/" +
                chalk.blue(peerInfo.id.toB58String())
        )
    );
    return node;
};

const handleStart = async node => {
    // node.on("peer:connect", peerInfo => {
    //     console.log(
    //         "  Someone found me!  on:",
    //         chalk.blue(`on: ${peerInfo.id.toB58String()}`)
    //     );
    // });

    node.on("peer:discovery", peerInfo => {
        console.log(
            "  I found someone! on:",
            chalk.blue(`${peerInfo.id.toB58String()}`)
        );
        hashtable.put(peerInfo, 0);
    });

    node.on("peer:disconnect", peerInfo => {
        console.log("  Peer disconnected");
    });

    setTimeout(async () => {
        console.log(chalk.red.bold("Dialing on protocol /propose/1.0.0:"));
        await hashtable.keys().forEach(async peer => {
            console.log(`  dialing to ${chalk.blue(peer.id.toB58String())}`);
            const { stream } = await node.dialProtocol(peer, "/propose/1.0.0");
            stdinToStream(stream);
            handleData(stream);

            function handleData(stream) {
                pipe(
                    // Read from the stream (the source)
                    stream.source,
                    // Decode length-prefixed data
                    lp.decode(),
                    // Sink function
                    async function(source) {
                        // For each chunk of data
                        for await (const msg of source) {
                            // Output the data as a utf8 string
                            const data = msg.toString("utf8").replace("\n", "");
                            console.log("> " + data);
                            if (data.substring(0, 6) === "accept") {
                                const amount = data.substring(7);
                                console.log("amount detected: " + amount);

                                hashtable.put(peer, amount);
                                await node.unhandle("/propose/1.0.0");
                                await node.hangUp(peer);
                                console.log(
                                    chalk.red.bold("Protocol Unhandled")
                                );
                                console.log(chalk.red.bold("Hanging up"));
                                console.log(chalk.yellow.bold("Investing:"));
                                await invest(PRIVATE_KEY, 0.02, 0.1);
                            }
                        }
                    }
                );
            }
        });
    }, 1000);
};

function pickBestPeer(hashtable) {
    let maximum = 0;
    hashtable.keys().forEach(async peer => {
        const amount = hashtable.get();
        if (amount > maximum) {
            maximum = amount;
        }
    });
    return maximum;
}

// function invest() {
//     console.log("....... i n v e s t i n g .......");
//     const data = "done";
//     p.push(data);
// }

// main
(async () => {
    const node = await createNode();
    await handleStart(node);
})();

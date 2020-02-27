/* Same as Peach but dont init connection - act as contractors */

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

const { stdinToStream, streamToConsole } = require("./stream");

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

const logAddress = node => {
    node.peerInfo.multiaddrs.forEach(ma =>
        console.log(
            "  " +
                ma.toString() +
                "/p2p/" +
                chalk.blue(node.peerInfo.id.toB58String())
        )
    );
};

const handleStart = async node => {
    console.log("node has started (true/false):", node.isStarted());
    console.log(chalk.red.bold("Listening on:"));
    logAddress(node);
    const knownPeers = [];

    // when someone finds me
    node.on("peer:connect", peerInfo => {
        console.log(
            "  Someone found me!",
            chalk.blue(`on: ${peerInfo.id.toB58String()}`)
        );
    });

    await node.handle("/propose/1.0.0", async ({ stream }) => {
        console.log(chalk.red.bold("Listening on protocol /propose/1.0.0:"));
        stdinToStream(stream);
        streamToConsole(stream);
    });

    // when I find someone - add them to my known list
    // node.on("peer:discovery", peerInfo => {
    //     console.log(
    //         "  I found someone!",
    //         chalk.blue(` on: ${peerInfo.id.toB58String()}`)
    //     );
    //     knownPeers.push(peerInfo);
    // });
};

// main
(async () => {
    const node = await createNode();
    await handleStart(node);
})();

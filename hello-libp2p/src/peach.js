"use strict";
/* eslint-disable no-console */

const PeerId = require("peer-id");
const PeerInfo = require("peer-info");
const pull = require("pull-stream");
const Pushable = require("pull-pushable");
const p = Pushable();
const chalk = require("chalk");

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
    let knownPeers = [];
    node.on("peer:connect", peerInfo => {
        console.log(
            "  Someone found me!  on:",
            chalk.blue(`on: ${peerInfo.id.toB58String()}`)
        );
    });

    node.on("peer:discovery", peerInfo => {
        console.log(
            "  I found someone! on:",
            chalk.blue(`${peerInfo.id.toB58String()}`)
        );
        knownPeers.push(peerInfo);
    });

    setTimeout(() => {
        console.log(chalk.red.bold("Proposing to All:"));

        knownPeers.forEach(peer => {
            console.log(`  dialing to ${chalk.blue(peer.id.toB58String())}`);
            node.dialProtocol(peer, "/propose/1.0.0");
        });
    }, 1000);
};
// main
(async () => {
    const node = await createNode();
    await handleStart(node);
})();

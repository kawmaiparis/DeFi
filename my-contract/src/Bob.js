// ----- Bob is Listener ------

"use strict";
const PeerId = require("peer-id");
const PeerInfo = require("peer-info");
const chalk = require("chalk");
const pipe = require("it-pipe");
const lp = require("it-length-prefixed");

const multiaddr = require("multiaddr");
const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");
// const { stdinToStream, streamToConsole } = require("./stream");
const { tokenize } = require("./parser");
const { handleCommand } = require("./handleCommand");
const { depositToContract } = require("./contractCall");

// allow multiple independent streams of communication across one network connection
const Multiplex = require("libp2p-mplex");

// peer encryption
const SECIO = require("libp2p-secio");

// for finding peers in network without hardcoding
const MulticastDNS = require("libp2p-mdns");

let peer = null;
const MY_PROPOSAL = "20";
const THEIR_PROPOSAL = "0";
const bobPrivateKey =
    "0x8a9d16d5aee4cc35c090f2d0fe6e6c8e57cf658048ce631dbbea0fe550bc77cd";
const name = "BOB";

const createNode = async () => {
    const peerInfo = await PeerInfo.create();
    peerInfo.multiaddrs.add("/ip4/127.0.0.1/tcp/0");
    const node = await Libp2p.create({
        peerInfo,
        modules: {
            transport: [TCP],
            streamMuxer: [Multiplex],
            connEncryption: [SECIO],
            peerDiscovery: [MulticastDNS],
        },
        config: {
            peerDiscovery: {
                mdns: {
                    interval: 20e3,
                    enabled: true,
                },
            },
        },
    });
    await node.start();
    console.log("node has started (true/false):", node.isStarted());
    console.log(chalk.red.bold("BOB listening on:"));
    node.peerInfo.multiaddrs.forEach((ma) =>
        console.log(
            "  " +
                ma.toString() +
                "/p2p/" +
                chalk.blue(peerInfo.id.toB58String())
        )
    );
    return node;
};

const listen = async (node) => {
    console.log("");

    node.on("peer:discovery", (peerInfo) => {
        // console.log(
        //     "  I found someone! on:",
        //     chalk.blue(`${peerInfo.id.toB58String()}`)
        // );
        peer = peerInfo;
    });

    node.on("peer:disconnect", (peerInfo) => {
        console.log("  Peer disconnected");
    });

    // node.on("peer:connect", (peerInfo) => {
    //     console.log(
    //         "  Someone found me!  on:",
    //         chalk.blue(`on: ${peerAddress.id.toB58String()}`)
    //     );
    // });

    let session = 0;

    node.handle("/negotiation/1.0.0", async ({ protocol, stream }) => {
        pipe(stream, async function (source) {
            for await (const msg of source) {
                console.log(
                    `  Intiated on protocol: ${protocol} |`,
                    chalk.red.bold("Session: 1")
                );
                console.log(`  -> Received msg: ${msg.toString()}`);
            }
        });
        await setTimeout(async () => {
            // Simulating proposal analysis
            const { stream: stream1 } = await node.dialProtocol(
                peer,
                "/invest/1.0.1"
            );
            console.log("");
            console.log("  Proposal Accepted and I want to invest 0.01 ETH");
            await pipe(["Accept and 0.01 ETH"], stream1);
            console.log("");
        }, 8000);
    });

    node.handle("/invest/1.0.2", async ({ protocol, stream }) => {
        pipe(stream, async function (source) {
            for await (const msg of source) {
                console.log(`  -> Received msg: ${msg.toString()}`);
            }
        });

        await setTimeout(async () => {
            // Simulating proposal analysis
            const { stream: stream3 } = await node.dialProtocol(
                peer,
                "/invest/1.0.3"
            );
            console.log(
                "  Deposit 0.01 to contract 0x40577Ed667C22925f509714B307ae66B6c755c9E"
            );

            console.log("");
            console.log("  Informing Task Completion");
            await pipe(["Completed"], stream3);
        }, 8000);
    });
};

const handleStart = async (node) => {};

(async () => {
    const node = await createNode();
    await listen(node);
})();

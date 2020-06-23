// ----- Alice is Dialer ------

"use strict";
const PeerId = require("peer-id");
const PeerInfo = require("peer-info");
const chalk = require("chalk");
const pipe = require("it-pipe");
const lp = require("it-length-prefixed");

const multiaddr = require("multiaddr");
const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");
const { tokenize } = require("./parser");
const { handleCommand } = require("./handleCommand");
const { depositToContract } = require("./contractCall");
// const { stdinToStream, streamToConsole } = require("./stream");
const readline = require("readline");
const ethers = require("ethers");
const name = "ALICE";

// allow multiple independent streams of communication across one network connection
const Multiplex = require("libp2p-mplex");

// peer encryption
const SECIO = require("libp2p-secio");

// for finding peers in network without hardcoding
const MulticastDNS = require("libp2p-mdns");

let peer = null;
const DISCOVERY_DURATION = 7000;
const MY_PROPOSAL = "50";
const THEIR_PROPOSAL = "";
const alicePrivateKey =
    "0x04d9096296be352b4cd0de36da9a65f0f7947f935484d40fdae8dbe8bc50418d";

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
    console.log(chalk.red.bold("ALICE listening on:"));
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

const handleStart = async (node) => {
    node.on("peer:discovery", (peerInfo) => {
        console.log("");
        console.log(
            "  Found another agent on:",
            chalk.blue(`${peerInfo.id.toB58String()}`)
        );
        peer = peerInfo;
        console.log("");
    });

    node.handle("/invest/1.0.1", async ({ protocol, stream }) => {
        pipe(stream, async function (source) {
            for await (const msg of source) {
                console.log(`  -> Received msg: ${msg.toString()}`);
            }
        });
        await setTimeout(async () => {
            // Simulating proposal analysis
            const { stream: stream2 } = await node.dialProtocol(
                peer,
                "/invest/1.0.2"
            );
            console.log("  Accept");
            await pipe(["Accept"], stream2);
            console.log("");
        }, 8000);
    });

    node.handle("/invest/1.0.3", async ({ protocol, stream }) => {
        pipe(stream, async function (source) {
            for await (const msg of source) {
                console.log(`  -> Received msg: ${msg.toString()}`);
            }
        });

        await setTimeout(async () => {
            console.log(
                "  Deposit 0.01 to contract 0x40577Ed667C22925f509714B307ae66B6c755c9E"
            );
            console.log("");
            console.log("  Negotiation Completed");
        }, 8000);
    });

    setTimeout(async () => {
        if (peer == null) {
            console.log(
                "Timeout: no agent found in",
                DISCOVERY_DURATION,
                "(ms)"
            );
            return;
        }

        const { stream: stream0 } = await node.dialProtocol(
            peer,
            "/negotiation/1.0.0"
        );
        console.log(
            "  Dialing to them on protocol: /negotiation/1.0.0 |",
            chalk.red.bold("Session: 1")
        );
        console.log("  Propose to invest 0.01 ETH");
        await pipe(["0.01 ETH"], stream0);
        console.log("");
    }, DISCOVERY_DURATION);
};

(async () => {
    const node = await createNode();
    await handleStart(node);
})();

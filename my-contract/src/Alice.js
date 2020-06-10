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
const DISCOVERY_DURATION = 5000;
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
        console.log(
            "  I found someone! on:",
            chalk.blue(`${peerInfo.id.toB58String()}`)
        );
        peer = peerInfo;
    });

    node.on("peer:disconnect", (peerInfo) => {
        console.log("  Peer disconnected");
    });

    node.on("peer:disconnect", (peerInfo) => {
        console.log("  Peer disconnected");
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
        const { stream } = await node.dialProtocol(peer, "/invest/1.0.0");

        console.log("Dialer dialed to listener on protocol: /invest/1.0.0");
        console.log("Input your proposal");

        // Send stdin to the stream
        stdinToStream(stream);
        // Read the stream and output to console
        streamToConsole(stream);

        function stdinToStream(stream) {
            // Read utf-8 from stdin
            process.stdin.setEncoding("utf8");
            pipe(
                // Read from stdin (the source)
                process.stdin,
                // Encode with length prefix (so receiving side knows how much data is coming)
                lp.encode(),
                // Write to the stream (the sink)
                stream.sink
            );
        }

        function streamToConsole(stream) {
            pipe(
                // Read from the stream (the source)
                stream.source,
                // Decode length-prefixed data
                lp.decode(),
                // Sink function
                async function (source) {
                    // For each chunk of data
                    for await (const msg of source) {
                        // Output the data as a utf8 string
                        const data = msg.toString("utf8").replace("\n", "");
                        console.log("> " + data);
                        const tokenizedData = tokenize(data);

                        if (tokenizedData == "invalid") {
                            console.log("Invalid Command");
                        } else {
                            const ret = handleCommand(tokenizedData);
                            if (ret === 1) {
                                console.log(
                                    "writing to smart contract with",
                                    chalk.red.bold(MY_PROPOSAL),
                                    "(ETH)"
                                );
                                depositToContract(
                                    alicePrivateKey,
                                    MY_PROPOSAL,
                                    name
                                );
                            } else if (ret === -1) {
                                console.log(
                                    "Ending protocol: /invest/1.0.0 and disconnecting..."
                                );
                                process.exit();
                                return -1;
                            }
                        }
                    }
                }
            );
        }
    }, DISCOVERY_DURATION);
};

(async () => {
    const node = await createNode();
    await handleStart(node);
})();

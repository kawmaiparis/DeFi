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
    console.log("Listening for agents...");
    // node.on("peer:connect", (peerInfo) => {
    //     console.log(
    //         "  Someone found me!  on:",
    //         chalk.blue(`on: ${peerAddress.id.toB58String()}`)
    //     );
    // });

    node.on("peer:discovery", (peerInfo) => {
        let peer = peerInfo.id.toB58String();
        console.log(
            "  I found someone! on:",
            chalk.blue(`${peer.id.toB58String()}`)
        );
    });
    node.handle("/invest/1.0.0", async ({ stream }) => {
        console.log("Handling protocol chat...");
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
                            if (handleCommand(tokenizedData) === 1) {
                                "writing to smart contract with",
                                    chalk.red.bold(MY_PROPOSAL),
                                    "(ETH)";
                                depositToContract(
                                    bobPrivateKey,
                                    MY_PROPOSAL,
                                    name
                                );
                            }
                        }
                    }
                }
            );
        }
    });
};

(async () => {
    const node = await createNode();
    await listen(node);
})();

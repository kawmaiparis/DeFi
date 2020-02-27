const PeerId = require("peer-id");
const PeerInfo = require("peer-info");
const Node = require("./libp2p_bundle");
const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");
const SECIO = require("libp2p-secio");
const Multiplex = require("libp2p-mplex");
const MulticastDNS = require("libp2p-mdns");
const chalk = require("chalk");

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
    await node.start(err => console.log("whhhha"));

    return node;
};

(async () => {
    const node = await createNode();
    await node.start(err => console.log("whhhha"));
    // const res = await handleStart(node);
    // console.log(res);
    console.log("hello");
})();

// const handleStart = nodeListener => {
//     return new Promise((resolve, reject) => {
//         nodeListener.start(err => {
//             if (err) {
//                 throw err;
//             }
//             console.log(
//                 emoji.get("moon"),
//                 chalk.blue(" Moon ready "),
//                 emoji.get("headphones"),
//                 chalk.blue(" Listening on: ")
//             );
//             peerInfo.multiaddrs.forEach(ma => {
//                 console.log(ma.toString() + "/p2p/" + peerId.toB58String());
//             });
//             console.log(
//                 "\n" + emoji.get("moon"),
//                 chalk.blue(" Moon trying to connect with Earth "),
//                 emoji.get("large_blue_circle")
//             );
//             resolve("yo");
//         });
//     });
// };

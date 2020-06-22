"use strict";

const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");
const SECIO = require("libp2p-secio");
const PeerInfo = require("peer-info");

const createNode = async peerInfo => {
    // To signall the addresses we want to be available, we use
    // the multiaddr format, a self describable address
    peerInfo.multiaddrs.add("/ip4/0.0.0.0/tcp/0");
    const node = await Libp2p.create({
        peerInfo,
        modules: {
            transport: [TCP],
            connEncryption: [SECIO]
        }
    });

    await node.start();
    return node;
};

(async () => {
    const peerInfo = await PeerInfo.create();
    const node = await createNode(peerInfo);

    // At this point the node has started
    console.log("node has started (true/false):", node.isStarted());
    // And we can print the now listening addresses.
    // If you are familiar with TCP, you might have noticed
    // that we specified the node to listen in 0.0.0.0 and port
    // 0, which means "listen in any network interface and pick
    // a port for me
    console.log("listening on:");
    node.peerInfo.multiaddrs.forEach(ma =>
        console.log(ma.toString() + "/p2p/" + peerInfo.id.toB58String())
    );
})();

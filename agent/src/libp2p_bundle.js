const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");
const defaultsDeep = require("@nodeutils/defaults-deep");
const Multiplex = require("libp2p-mplex");
const SECIO = require("libp2p-secio");
const MulticastDNS = require("libp2p-mdns");

const DEFAULT_OPTS = {
    modules: {
        transport: [TCP],
        connEncryption: [SECIO],
        streamMuxer: [Multiplex],
        peerDiscovery: [MulticastDNS]
    }
};
class P2PNode extends Libp2p {
    constructor(opts) {
        super(defaultsDeep(opts, DEFAULT_OPTS));
    }
}
module.exports = P2PNode;

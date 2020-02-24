const PeerId = require("peer-id");
const crypto = require("libp2p-crypto");

async function main() {
    const key = await crypto.keys.generateKeyPair("secp256k1", 256);
    console.log(key.public._key.toString());
}

main();

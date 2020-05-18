// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
    // This is just a convenience check
    if (network.name === "buidlerevm") {
        console.warn(
            "You are trying to deploy a contract to the Buidler EVM network, which" +
                "gets automatically created and destroyed every time. Use the Buidler" +
                " option '--network localhost'"
        );
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

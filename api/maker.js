const Maker = require("@makerdao/dai");

/* account 1 */
const PRIVATE_KEY =
    "0x05D6E90A4668FDCDFA03DCB6AC5F3F5B5E4D06070CD92A488DE464E39587566B";

/* account 3 */
// const PRIVATE_KEY =
//   "0x862551255A92AF0B31222952088F75993F3F1E9E8AB4BA0BF88359DFE8159B4D";

const URL = "https://kovan.infura.io/v3/b839d484af444e308e098f46555e0260";

module.exports = {
    create_maker: async () => {
        const maker = await Maker.create("http", {
            privateKey: PRIVATE_KEY,
            url: URL
        });
        return maker;
    },

    create_maker_test: async () => {
        const maker = await Maker.create("test");
        console.log(maker);
        return maker;
    }
};

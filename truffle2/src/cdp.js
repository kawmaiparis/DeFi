const Maker = require("@makerdao/dai");

/* account 1 */
const PRIVATE_KEY =
    "0x05D6E90A4668FDCDFA03DCB6AC5F3F5B5E4D06070CD92A488DE464E39587566B";

/* account 3 */
// const PRIVATE_KEY =
//   "0x862551255A92AF0B31222952088F75993F3F1E9E8AB4BA0BF88359DFE8159B4D";

const URL = "https://kovan.infura.io/v3/b839d484af444e308e098f46555e0260";

module.exports = {
    open: async function(req, res, next) {
        try {
            const maker = await Maker.create("http", {
                privateKey: PRIVATE_KEY,
                url: URL
            });

            console.log("test");
            const cdp = await maker.openCdp();
            console.log(cdp.id);
            res.locals.cdp_id = cdp.id;

            return endpoints.success(req, res);
        } catch (e) {
            console.log("Something went wrong.");
            console.log(e);
            return endpoints.error(req, res);
        }
    }
};

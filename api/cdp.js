import endpoints from "./endpoints";
import makerHandler from "./maker";

const Maker = require("@makerdao/dai");
const { MKR, DAI, ETH, WETH, PETH, USD_ETH, USD_MKR, USD_DAI } = Maker;

module.exports = {
    test: function() {
        console.log("log test");
    },

    // open CDP
    open: async function(req, res, next) {
        try {
            const maker = await makerHandler.create_maker();
            console.log("hello");
            const cdp = await maker.openCdp();
            console.log(cdp.id);
            res.locals.cdp_id = cdp.id;

            return endpoints.success(req, res);
        } catch (e) {
            console.log("Something went wrong.");
            console.log(e);
            return endpoints.error(req, res);
        }
    },

    // deposit ETH into CDP
    deposit: async function(req, res, next) {
        try {
            const maker = await makerHandler.create_maker_test();
            const cdp = await maker.openCdp();
            await cdp.lockEth(amount);
            return endpoints.success(req, res);
        } catch (e) {
            console.log("Something went wrong.");
            console.log(e);
            return endpoints.error(req, res);
        }
    },

    // withdraw ETH from CDP
    withdraw: async function(req, res, next) {
        try {
            const maker = await makerHandler.create_maker_test();
            const cdp = await maker.openCdp();
            // await cdp.drawDai(DaiToDraw);
            return endpoints.success(req, res);
        } catch (e) {
            console.log("Something went wrong.");
            console.log(e);
            return endpoints.error(req, res);
        }
    },

    // payback
    payback: async function(req, res, next) {
        try {
            const maker = await makerHandler.create_maker_test();
            const cdp = await maker.openCdp();
            cdp.wipeDai(DAI(amount));
            return endpoints.success(req, res);
        } catch (e) {
            console.log("Something went wrong.");
            console.log(e);
            return endpoints.error(req, res);
        }
    },

    // borrow
    borrow: async function(req, res, next) {
        try {
            const maker = await makerHandler.create_maker_test();
            const cdp = await maker.openCdp();
            await cdp.wipeDai(DAI(amount));
            return endpoints.success(req, res);
        } catch (e) {
            console.log("Something went wrong.");
            console.log(e);
            return endpoints.error(req, res);
        }
    },

    // exit
    exit: async function(req, res, next) {
        try {
            const maker = await makerHandler.create_maker_test();
            const cdp = await maker.openCdp();
            await cdp.shut();
            return endpoints.success(req, res);
        } catch (e) {
            console.log("Something went wrong.");
            console.log(e);
            return endpoints.error(req, res);
        }
    }
};

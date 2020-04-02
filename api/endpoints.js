module.exports = {
    success: (req, res) => {
        res.status(200).send({
            success: "true",
            data: res.locals
        });
    },
    error: (req, res) => {
        console.log("here");
        res.status(300).send({
            success: "false",
            data: res.locals
        });
    }
};

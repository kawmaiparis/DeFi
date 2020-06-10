const Tokenizr = require("tokenizr");

let lexer = new Tokenizr();

const validCommands = ["deposit", "withdraw", "propose", "accept", "reject"];
// deposit 2
// withdraw 9
// agree

lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (ctx, match) => {
    ctx.accept("command");
});
lexer.rule(/[+-]?[0-9]+/, (ctx, match) => {
    ctx.accept("number", parseInt(match[0]));
});
lexer.rule(/"((?:\\"|[^\r\n])*)"/, (ctx, match) => {
    ctx.accept("string", match[1].replace(/\\"/g, '"'));
});
lexer.rule(/\/\/[^\r\n]*\r?\n/, (ctx, match) => {
    ctx.ignore();
});
lexer.rule(/[ \t\r\n]+/, (ctx, match) => {
    ctx.ignore();
});

lexer.rule(/./, (ctx, match) => {
    ctx.accept("char");
});

tokenize("withdraw 22");
function tokenize(str) {
    let ret = [];
    lexer.input(str);
    // lexer.debug(true);
    lexer.tokens().forEach((token) => {
        if (token.type == "command" && !validCommands.includes(token.value)) {
            console.error("invalid command");
            return "invalid";
        }
        ret.push(token.value);
    });
    return ret;
}

//const agent = new Agent('Jeep', 3);

// prompt.get(strategy, function (err, result) {
// if (err) { return onErr(err); }
// agent.strategy.push(result.strategy);
// console.log('Strategy that you just entered:');
// console.log(' Strategy: ' + result.strategy);
// console.log(agent.strategy.length);
// });

// agent.strategy.push(strat);
//agent.payDebtAndFreeCollateral(10, 0, 1);
//agent.getCdpDetail(1);

//agent.depositAndWithdraw(0,20,2);

module.exports = {
    tokenize,
};

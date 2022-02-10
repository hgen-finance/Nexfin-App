const BN = require('bn.js')

const getCollateral = (gens, lamports, usd) => {
    console.log(`gens: ${gens}, lamports :${lamports}, usd:${usd}`);
    return new BN(lamports).div(new BN("10000000")).mul(new BN(usd)).div(new BN(gens))
}

module.exports = {
    getCollateral,
}
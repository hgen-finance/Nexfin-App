import * as BufferLayout from "buffer-layout";
import * as borsh from "@project-serum/borsh";

import { TOKEN_SWAP_PROGRAM_ID } from '@/utils/tokenSwap';


import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

/**
 * Layout for a public key
 */
const publicKey = (property = "publicKey") => {
    return BufferLayout.blob(32, property);
};

// set this for farming
export const farmingProgramIdString =
    "EXgCpsUR6DayempLFhq4mMdaKuZroRmjtRTRo6t9iGMB";
//set this for borrow
// export const EscrowProgramIdString = '2NybGeQqFutpNn29DyvS4LgyHX8wLd9Dy4KMhpTTvS8i'
// export const EscrowProgramIdString = "5kLDDxNQzz82UtPA5hJmyKR3nUKBtRTfu4nXaGZmLanS";
//export const EscrowProgramIdString = '4XpqGMbFvrvHxXWyCDWNgyhVVVdh4G7Btp18NKr4Yp6T'
export const EscrowProgramIdString = "HPwvr8B9KtM3CZwQg7V8pevfgsZfZBLiR3gL1HcEsGiD";

/**
 * Layout for a 64bit unsigned value
 */
const uint64 = (property = "uint64") => {
    return BufferLayout.blob(8, property);
};
const dateArray = (property = "date") => {
    return BufferLayout.seq(BufferLayout.u8(), 32, property);
};

const u8Array = (property = "data") => {
    return BufferLayout.seq(BufferLayout.u8(), 96, property);
};

// TODO: use borsh for buffer
export const TROVE_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
    BufferLayout.u8("isInitialized"),
    BufferLayout.u8("isLiquidated"),
    BufferLayout.u8("isReceived"),
    uint64("borrowAmount"),
    uint64("lamports"),
    uint64("teamFee"),
    uint64("depositorFee"),
    uint64("amountToClose"),
    publicKey("owner"),
]);

export const DEPOSIT_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
    BufferLayout.u8("isInitialized"),
    uint64("tokenAmount"),
    uint64("rewardTokenAmount"),
    uint64("rewardGovernanceTokenAmount"),
    uint64("rewardCoinAmount"),
    publicKey("bank"),
    publicKey("governanceBank"),
    publicKey("owner"),
]);

export const OWNER_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
    BufferLayout.u8("isInitialized"),
    publicKey("bank"),
    publicKey("governanceBank"),
    publicKey("owner"),
]);

export const FARMING_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
    BufferLayout.u8("isInitialized"),
    dateArray("startDate"),
    dateArray("endDate"),
    uint64("depositedSol"),
    uint64("depositedHgen"),
    uint64("dayLength"),
    uint64("dayLeft"),
]);

export const INSTRUCTION_LAYOUT = BufferLayout.struct([
    BufferLayout.u8("instructionId"),
    u8Array("data"),
]);

export interface InstructionLayout {
    instructionId: number;
    data: Uint8Array;
}

export interface TroveLayout {
    isInitialized: number;
    isLiquidated: number;
    isReceived: number;
    borrowAmount: Uint8Array;
    lamports: Uint8Array;
    teamFee: Uint8Array;
    depositorFee: Uint8Array;
    amountToClose: Uint8Array;
    owner: Uint8Array;
}

export interface DepositLayout {
    isInitialized: number;
    tokenAmount: Uint8Array;
    rewardTokenAmount: Uint8Array;
    rewardGovernanceTokenAmount: Uint8Array;
    rewardCoinAmount: Uint8Array;
    bank: Uint8Array;
    governanceBank: Uint8Array;
    owner: Uint8Array;
}

export interface FarmingLayout {
    isInitialized: number;
    startDate: Uint8Array;
    endDate: Uint8Array;
    depositedSol: Uint8Array;
    depositedHgen: Uint8Array;
    dayLength: Uint8Array;
    dayLeft: Uint8Array;
}

// export const TOKEN_GENS = new PublicKey('JCnyD2wyimf5P3MBVAxB5yCVhotmswDhvrwXdS9xNbAq')
//export const TOKEN_GENS = new PublicKey('C6tfES3TrhTzQnRopAyqHAjx4ixShAzJ16QeffWvoXBk')
export const TOKEN_GENS = new PublicKey(
    "2U3Mf4umT4CpLhhdwpfmGiktyvhdrLrNNv4z4GgsXNMe"
);
export const TOKEN_GENS_ACC = new PublicKey(
    "Dgb9x1ay5qEFHPimLJY9JZpTHcssdvYgM7aC5c2DVA73"
);
//export const TOKEN_HGEN = new PublicKey('4MxiWoWWgRmd7YAPmJNtaivDATVgpoGjHbrdF4d2EmoJ')
// export const TOKEN_HGEN = new PublicKey(
//     "6UeYcgjzpij4wGhVShJQsoCoi3nk2bPvz4v4Dz4cmMVv"
// );

export const TOKEN_HGEN = new PublicKey(
    "97MxeDbRgc6vYP1Sty2XdPXks3QhMD97EVYJ9pP4XcR3"
);

export const SYS_ACCOUNT = new PublicKey(
    "54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t"
);
export const CHAINLINK_SOL_USD_PUBKEY = new PublicKey(
    "FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf"
);

export const PYTH_SOL_USD_PUBKEY = new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix");

export const CLUSTER = process.env.CLUSTER || 'devnet';

export const TOKEN_A_MINT_ADDR = new PublicKey("2aNEZTF7Lw9nfYv6qQEuWDyngSrB5hbdfx35jpqwcKz8");
export const TOKEN_B_MINT_ADDR = new PublicKey("E2UTFZCt7iCAgaCMC3Qf7MQB73Zwjc6J1avz298tn6UC");
export const TOKEN_SWAP_ACCOUNT = new PublicKey("4Xjce6j7YAR9Rz1321oWJndxDWkh3vemUzzwT3XPW3yC");
export const TOKEN_ACC_A = new PublicKey("HqESSnK1XaQ33Ww4YecraNxEXJEs6zVwxDgQ5vWkSutX");
export const TOKEN_ACC_B = new PublicKey("CDAhGN7AoMzEmnfPKnAmpaH2HBKxg27MHwBrNmxMaQ8W");

export const POOL_AUTHORITY = new PublicKey("AiaMQPdxqxjNvJm4MAW3yAjp3kJRqyrE9gUrRgRAPXu4");
export const LP_TOKENS = new PublicKey("3nHK28wsZvGpVj99XvEL5FgVUzh4dUcoP3MsN3pA38aV")

// export const pda_account_for_mint = new PublicKey("");

export const getCollateral = (gens: string, lamports: string, usd: string) => {
    // TODO might need to change the value later here
    //   console.log(`gens:${gens}, lamports:${lamports}, usd:${usd}}`);
    let result = 0;
    if (gens === "0") {
        return result;
    } else {
        result = new BN(lamports)
            .div(new BN("10000000"))
            .mul(new BN(usd))
            .div(new BN(gens))
            .toNumber();
    }
    return result;
};

// cr = lamport/1000000000 * usd / gens
// gens = lamport / 100000000

// 4Xjce6j7YAR9Rz1321oWJndxDWkh3vemUzzwT3XPW3yC token swap account 
// instrument.js?ea14:109 Uint8Array(64) [71, 29, 9, 134, 253, 202, 211, 116, 196, 165, 151, 138, 46, 7, 99, 248, 233, 247, 175, 85, 236, 46, 230, 12, 88, 81, 175, 18, 236, 220, 192, 244, 52, 114, 171, 93, 94, 29, 33, 249, 39, 180, 91, 249, 67, 223, 69, 72, 155, 180, 170, 127, 88, 137, 220, 75, 29, 191, 203, 35, 176, 62, 63, 43, buffer: ArrayBuffer(64), byteLength: 64, byteOffset: 0, length: 64, Symbol(Symbol.toStringTag): 'Uint8Array'] 'token swap account secret key'
// instrument.js?ea14:109 AiaMQPdxqxjNvJm4MAW3yAjp3kJRqyrE9gUrRgRAPXu4 pda Authority pubkey
// instrument.js?ea14:109 424v2hHJtDA879UfMikVWr7VTvJsFqE9XaZkkbe6Uv2J Owner of the token account pool
// instrument.js?ea14:109 Uint8Array(64) [9, 144, 110, 139, 48, 125, 167, 207, 173, 176, 11, 129, 179, 22, 18, 114, 123, 93, 99, 143, 118, 111, 0, 25, 85, 234, 46, 204, 17, 192, 212, 121, 44, 217, 17, 71, 134, 196, 99, 214, 170, 18, 255, 194, 189, 214, 34, 9, 87, 168, 200, 246, 104, 250, 40, 187, 226, 11, 48, 0, 137, 38, 179, 103, buffer: ArrayBuffer(64), byteLength: 64, byteOffset: 0, length: 64, Symbol(Symbol.toStringTag): 'Uint8Array'] 'owner secret key for the mint token'
// instrument.js?ea14:109 creating pool mint
// instrument.js?ea14:109 3nHK28wsZvGpVj99XvEL5FgVUzh4dUcoP3MsN3pA38aV Pool token mint addr
// creating pool account
// 4gtUz5zyZKm6EKdHcPzXYQv789aPCAMK5ZfHGbZ9HkDL fee account
// instrument.js ? ea14 : 109 creating token GENS
// instrument.js ? ea14 : 109 2aNEZTF7Lw9nfYv6qQEuWDyngSrB5hbdfx35jpqwcKz8 gens mint addr
// instrument.js ? ea14 : 109 creating token GENS account
// instrument.js ? ea14 : 109 HqESSnK1XaQ33Ww4YecraNxEXJEs6zVwxDgQ5vWkSutX pda GENS token account
// instrument.js ? ea14 : 109 gens account
// instrument.js ? ea14 : 109 minting token GENS to swap
// creating token HGEN
// instrument.js ? ea14 : 109 E2UTFZCt7iCAgaCMC3Qf7MQB73Zwjc6J1avz298tn6UC hgen mint addr
// instrument.js ? ea14 : 109 creating token HGEN account
// instrument.js ? ea14 : 109 CDAhGN7AoMzEmnfPKnAmpaH2HBKxg27MHwBrNmxMaQ8W pda HGEN token account
// instrument.js ? ea14 : 109 minting token HGEN to swap
// creating token swap
// instrument.js ? ea14 : 109 54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t payer for the token of swap pool
// loading token swap
// instrument.js?ea14:109 TokenSwap {connection: Connection, tokenSwap: PublicKey, swapProgramId: PublicKey, tokenProgramId: PublicKey, poolToken: PublicKey, …}authority: PublicKey {_bn: BN}connection: Connection {_commitment: 'confirmed', _confirmTransactionInitialTimeout: undefined, _rpcEndpoint: 'https://api.devnet.solana.com', _rpcWsEndpoint: 'wss://api.devnet.solana.com/', _rpcClient: ClientBrowser, …}curveType: 0feeAccount: PublicKey {_bn: BN}hostFeeDenominator: Numberu64 {negative: 0, words: Array(3), length: 1, red: null}hostFeeNumerator: Numberu64 {negative: 0, words: Array(3), length: 1, red: null}mintA: PublicKey {_bn: BN}mintB: PublicKey {_bn: BN}ownerTradeFeeDenominator: Numberu64 {negative: 0, words: Array(3), length: 1, red: null}ownerTradeFeeNumerator: Numberu64 {negative: 0, words: Array(3), length: 1, red: null}ownerWithdrawFeeDenominator: Numberu64 {negative: 0, words: Array(3), length: 1, red: null}ownerWithdrawFeeNumerator: Numberu64 {negative: 0, words: Array(3), length: 1, red: null}payer: PublicKey {_bn: BN}poolToken: PublicKey {_bn: BN}swapProgramId: PublicKey {_bn: BN}tokenAccountA: PublicKey {_bn: BN}tokenAccountB: PublicKey {_bn: BN}tokenProgramId: PublicKey {_bn: BN}tokenSwap: PublicKey {_bn: BN}tradeFeeDenominator: Numberu64 {negative: 0, words: Array(3), length: 1, red: null}tradeFeeNumerator: Numberu64 {negative: 0, words: Array(3), length: 1, red: null}[[Prototype]]: Object 'Token swap info'
// instrument.js?ea14:109 {tokenAmountA: 10000, tokenAmountB: 10000}
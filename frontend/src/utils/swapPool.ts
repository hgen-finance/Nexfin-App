
import {
    Account,
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    Keypair
} from '@solana/web3.js';

import { AccountLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TokenSwap, CurveType, TOKEN_SWAP_PROGRAM_ID, Numberu64 } from '@/utils/tokenSwap';
import { sendAndConfirmTransaction } from '@/utils/tokenSwap/util/send-and-confirm-transaction';
import { newAccountWithLamports } from '@/utils/tokenSwap/util/new-account-with-lamports';
import { url } from '@/utils/tokenSwap/util/url';
import { sleep } from '@/utils/tokenSwap/util/sleep';

import { Pool } from '@/store/interfaces/poolInterface';
import Wallet from "@project-serum/sol-wallet-adapter";


// The following globals are created by `createTokenSwap` and used by subsequent tests
// Token swap
let tokenSwap: TokenSwap;
// authority of the token and accounts
let authority: PublicKey;
// bump seed used to generate the authority public key
let bumpSeed: number;
// owner of the user accounts
let owner: Account;
// Token pool
let tokenPool: Token;
let tokenAccountPool: PublicKey;
let feeAccount: PublicKey;
// Tokens swapped
let GENS: Token; // GENS TOKEN
let HGEN: Token; // HGEN TOKEN
let tokenAccountGENS: PublicKey;
let tokenAccountHGEN: PublicKey;

// user tokens account
let userAccountGENS: PublicKey;
let userAccountHGEN: PublicKey;

// pool info
let poolInfo: Pool;

// Hard-coded fee address, for testing production mode
const SWAP_PROGRAM_OWNER_FEE_ADDRESS =
    process.env.SWAP_PROGRAM_OWNER_FEE_ADDRESS || "54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t";

// Pool fees
const TRADING_FEE_NUMERATOR = 25;
const TRADING_FEE_DENOMINATOR = 10000;
const OWNER_TRADING_FEE_NUMERATOR = 5;
const OWNER_TRADING_FEE_DENOMINATOR = 10000;
const OWNER_WITHDRAW_FEE_NUMERATOR = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 0 : 1;
const OWNER_WITHDRAW_FEE_DENOMINATOR = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 0 : 6;
const HOST_FEE_NUMERATOR = 20;
const HOST_FEE_DENOMINATOR = 100;

// Initial amount in each swap token
let currentSwapTokenA = 1000000;
let currentSwapTokenB = 1000000;
// TODO: use it when tokenAccount is finalized
// let currentFeeAmount = await tokenPool.getAccountInfo(feeAccount);
// only for testing
let currentFeeAmount = 0;

// Swap instruction constants
// Because there is no withdraw fee in the production version, these numbers
// need to get slightly tweaked in the two cases.
let SWAP_AMOUNT_IN = 10000;
// 90661 : 90674;
let SWAP_AMOUNT_OUT = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 8061 : 8067;
// 22273 : 22277;
const SWAP_FEE = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 30000 : 30000;
const HOST_SWAP_FEE = SWAP_PROGRAM_OWNER_FEE_ADDRESS
    ? Math.floor((SWAP_FEE * HOST_FEE_NUMERATOR) / HOST_FEE_DENOMINATOR)
    : 0;
const OWNER_SWAP_FEE = SWAP_FEE - HOST_SWAP_FEE;

// Pool token amount minted on init
const DEFAULT_POOL_TOKEN_AMOUNT = 1000000000;
// Pool token amount to withdraw / deposit
const POOL_TOKEN_AMOUNT = 10000000;

function assert(condition: boolean, message?: string) {
    if (!condition) {
        console.log(Error().stack + ':../cli/swapPool.ts');
        throw message || 'Assertion failed';
    }
}

let connection: Connection;
async function getConnection(): Promise<Connection> {
    if (connection) return connection;

    connection = new Connection(url, 'recent');
    const version = await connection.getVersion();

    console.log('Connection to cluster established:', url, version);
    return connection;
}

export async function addToken(wallet: Wallet) {
    let check_gens = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: GENS.publicKey,
    });
    let genATA = check_gens.value[0] ? check_gens.value[0].pubkey.toBase58() : "";

    let check_hgen = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: HGEN.publicKey,
    });
    let hgenATA = check_hgen.value[0] ? check_hgen.value[0].pubkey.toBase58() : "";

    // check if there is already an gens and hgen account for the user
    if (genATA == "")
        userAccountGENS = await GENS.createAccount(wallet.publicKey);
    await GENS.mintTo(userAccountGENS, owner, [], 10000);

    if (hgenATA == "")
        userAccountHGEN = await HGEN.createAccount(wallet.publicKey);
    await HGEN.mintTo(userAccountHGEN, owner, [], 10000);
}

export async function createTokenSwap(
    curveType: number,
    wallet: Wallet,
    curveParameters?: Numberu64,
): Promise<any> {
    const connection = await getConnection();
    const payer = await newAccountWithLamports(connection, 1000000000);
    owner = await newAccountWithLamports(connection, 1000000000);
    const tokenSwapAccount = new Account();

    console.log(tokenSwapAccount.publicKey.toBase58(), "token swap account ");
    console.log(tokenSwapAccount.secretKey, "token swap account secret key");

    [authority, bumpSeed] = await PublicKey.findProgramAddress(
        [tokenSwapAccount.publicKey.toBuffer()],
        TOKEN_SWAP_PROGRAM_ID,
    );

    console.log(authority.toBase58(), "pda Authority pubkey");
    console.log(owner.publicKey.toBase58(), "Owner of the token account pool");
    console.log(owner.secretKey, "owner secret key for the mint token")
    console.log(payer.publicKey.toBase58(), "the payer for the account");

    console.log('creating pool mint');
    tokenPool = await Token.createMint(
        connection,
        payer,
        authority,
        null,
        2,
        TOKEN_PROGRAM_ID,
    );
    console.log(tokenPool.publicKey.toBase58(), "Pool token mint addr")

    console.log('creating pool account');
    tokenAccountPool = await tokenPool.createAccount(owner.publicKey);
    const ownerKey = SWAP_PROGRAM_OWNER_FEE_ADDRESS || owner.publicKey.toString();
    feeAccount = await tokenPool.createAccount(new PublicKey(ownerKey));

    console.log(feeAccount.toBase58(), "fee account");

    console.log('creating token GENS');
    GENS = await Token.createMint(
        connection,
        payer,
        owner.publicKey,
        null,
        2,
        TOKEN_PROGRAM_ID,
    );
    console.log(GENS.publicKey.toBase58(), 'gens mint addr')


    console.log('creating token GENS account');
    tokenAccountGENS = await GENS.createAccount(authority);
    console.log(tokenAccountGENS.toBase58(), "pda GENS token account")

    console.log('gens account')
    console.log('minting token GENS to swap');
    await GENS.mintTo(tokenAccountGENS, owner, [], currentSwapTokenA);

    console.log('creating token HGEN');
    HGEN = await Token.createMint(
        connection,
        payer,
        owner.publicKey,
        null,
        2,
        TOKEN_PROGRAM_ID,
    );
    console.log(HGEN.publicKey.toBase58(), 'hgen mint addr')

    console.log('creating token HGEN account');
    tokenAccountHGEN = await HGEN.createAccount(authority);
    console.log(tokenAccountHGEN.toBase58(), "pda HGEN token account")
    console.log('minting token HGEN to swap');
    await HGEN.mintTo(tokenAccountHGEN, owner, [], currentSwapTokenB);

    console.log('creating token swap');
    const swapPayer = wallet;
    console.log(swapPayer.publicKey.toBase58(), "payer for the token of swap pool")
    tokenSwap = await TokenSwap.createTokenSwap(
        connection,
        swapPayer,
        tokenSwapAccount,
        authority,
        tokenAccountGENS,
        tokenAccountHGEN,
        tokenPool.publicKey,
        GENS.publicKey,
        HGEN.publicKey,
        feeAccount,
        tokenAccountPool,
        TOKEN_SWAP_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        TRADING_FEE_NUMERATOR,
        TRADING_FEE_DENOMINATOR,
        OWNER_TRADING_FEE_NUMERATOR,
        OWNER_TRADING_FEE_DENOMINATOR,
        OWNER_WITHDRAW_FEE_NUMERATOR,
        OWNER_WITHDRAW_FEE_DENOMINATOR,
        HOST_FEE_NUMERATOR,
        HOST_FEE_DENOMINATOR,
        curveType,
        curveParameters,
    );

    console.log('loading token swap');
    const fetchedTokenSwap = await TokenSwap.loadTokenSwap(
        connection,
        tokenSwapAccount.publicKey,
        TOKEN_SWAP_PROGRAM_ID,
        swapPayer.publicKey,
    );

    console.log(fetchedTokenSwap, "Token swap info")

    assert(fetchedTokenSwap.tokenProgramId.equals(TOKEN_PROGRAM_ID));
    assert(fetchedTokenSwap.tokenAccountA.equals(tokenAccountGENS));
    assert(fetchedTokenSwap.tokenAccountB.equals(tokenAccountHGEN));
    assert(fetchedTokenSwap.mintA.equals(GENS.publicKey));
    assert(fetchedTokenSwap.mintB.equals(HGEN.publicKey));
    assert(fetchedTokenSwap.poolToken.equals(tokenPool.publicKey));
    assert(fetchedTokenSwap.feeAccount.equals(feeAccount));
    assert(
        TRADING_FEE_NUMERATOR == fetchedTokenSwap.tradeFeeNumerator.toNumber(),
    );
    assert(
        TRADING_FEE_DENOMINATOR == fetchedTokenSwap.tradeFeeDenominator.toNumber(),
    );
    assert(
        OWNER_TRADING_FEE_NUMERATOR ==
        fetchedTokenSwap.ownerTradeFeeNumerator.toNumber(),
    );
    assert(
        OWNER_TRADING_FEE_DENOMINATOR ==
        fetchedTokenSwap.ownerTradeFeeDenominator.toNumber(),
    );
    assert(
        OWNER_WITHDRAW_FEE_NUMERATOR ==
        fetchedTokenSwap.ownerWithdrawFeeNumerator.toNumber(),
    );
    assert(
        OWNER_WITHDRAW_FEE_DENOMINATOR ==
        fetchedTokenSwap.ownerWithdrawFeeDenominator.toNumber(),
    );
    assert(HOST_FEE_NUMERATOR == fetchedTokenSwap.hostFeeNumerator.toNumber());
    assert(
        HOST_FEE_DENOMINATOR == fetchedTokenSwap.hostFeeDenominator.toNumber(),
    );
    assert(curveType == fetchedTokenSwap.curveType);


    let gens_info = (await GENS.getAccountInfo(tokenAccountGENS)).amount;
    let hgen_info = (await HGEN.getAccountInfo(tokenAccountHGEN)).amount;

    poolInfo = {
        authority,
        owner: owner.publicKey,
        payer: payer.publicKey,
        tokenAccountPool,
        feeAccount,
        gensMintAddr: GENS.publicKey,
        hgenMintAddr: HGEN.publicKey,
        tokenAccountA: gens_info.toNumber(), // pool gen account
        tokenAccountB: hgen_info.toNumber(), // pool hgen account
    }
    return poolInfo;

}

export async function depositAllTokenTypes(
    wallet: Wallet,
    tokenAmountA: Number,
    tokenAmountB: Number,
): Promise<void> {
    const poolMintInfo = await tokenPool.getMintInfo();
    console.log(poolMintInfo, "poolmintinfo")
    const supply = poolMintInfo.supply.toNumber();
    console.log(supply, "supply");
    const swapTokenA = await GENS.getAccountInfo(tokenAccountGENS);
    const tokenA = Math.floor(
        (swapTokenA.amount.toNumber() * POOL_TOKEN_AMOUNT) / supply,
    );
    const swapTokenB = await HGEN.getAccountInfo(tokenAccountHGEN);
    const tokenB = Math.floor(
        (swapTokenB.amount.toNumber() * POOL_TOKEN_AMOUNT) / supply,
    );

    //TODO only for testing
    // const userTransferAuthority = new Account();
    const userTransferAuthority = wallet.publicKey
    console.log('Creating depositor token GENS account');
    // const userAccountGENS = await GENS.createAccount(wallet.publicKey);
    // TODO only for testing
    // await GENS.mintTo(userAccountGENS, owner, [], tokenA);
    // await GENS.approve(
    //     userAccountGENS,
    //     userTransferAuthority.publicKey,
    //     wallet.publicKey,
    //     [],
    //     tokenA,
    // );
    console.log('Creating depositor token HGEN account');
    // TODO only for testing
    // const userAccountHGEN = await HGEN.createAccount(wallet.publicKey);
    // await HGEN.mintTo(userAccountHGEN, owner, [], tokenB);
    // await HGEN.approve(
    //     userAccountHGEN,
    //     userTransferAuthority.publicKey,
    //     wallet.publicKey,
    //     [],
    //     tokenB,
    // );
    console.log('Creating depositor pool token account');
    const newAccountPool = await tokenPool.createAccount(wallet.publicKey);

    console.log('Depositing into swap');
    // TODO uncomment for test only
    await tokenSwap.depositAllTokenTypes(
        wallet,
        userAccountGENS,
        userAccountHGEN,
        newAccountPool,
        userTransferAuthority,
        POOL_TOKEN_AMOUNT,
        tokenA,
        tokenB,
    );

    let info;
    info = await GENS.getAccountInfo(userAccountGENS);
    assert(info.amount.toNumber() == 0);
    info = await HGEN.getAccountInfo(userAccountHGEN);
    assert(info.amount.toNumber() == 0);
    info = await GENS.getAccountInfo(tokenAccountGENS);
    assert(info.amount.toNumber() == currentSwapTokenA + tokenA);
    currentSwapTokenA += tokenA;
    info = await HGEN.getAccountInfo(tokenAccountHGEN);
    assert(info.amount.toNumber() == currentSwapTokenB + tokenB);
    currentSwapTokenB += tokenB;
    info = await tokenPool.getAccountInfo(newAccountPool);
    assert(info.amount.toNumber() == POOL_TOKEN_AMOUNT);
}

export async function withdrawAllTokenTypes(
    wallet: Wallet
): Promise<void> {
    const poolMintInfo = await tokenPool.getMintInfo();
    const supply = poolMintInfo.supply.toNumber();
    let swapTokenA = await GENS.getAccountInfo(tokenAccountGENS);
    let swapTokenB = await HGEN.getAccountInfo(tokenAccountHGEN);
    let feeAmount = 0;
    if (OWNER_WITHDRAW_FEE_NUMERATOR !== 0) {
        feeAmount = Math.floor(
            (POOL_TOKEN_AMOUNT * OWNER_WITHDRAW_FEE_NUMERATOR) /
            OWNER_WITHDRAW_FEE_DENOMINATOR,
        );
    }
    const poolTokenAmount = POOL_TOKEN_AMOUNT - feeAmount;
    const tokenA = Math.floor(
        (swapTokenA.amount.toNumber() * poolTokenAmount) / supply,
    );
    const tokenB = Math.floor(
        (swapTokenB.amount.toNumber() * poolTokenAmount) / supply,
    );

    console.log('Creating withdraw token A account');
    let userAccountGENS = await GENS.createAccount(owner.publicKey);
    console.log('Creating withdraw token B account');
    let userAccountHGEN = await HGEN.createAccount(owner.publicKey);

    const userTransferAuthority = new Account();
    console.log('Approving withdrawal from pool account');
    await tokenPool.approve(
        tokenAccountPool,
        userTransferAuthority.publicKey,
        owner,
        [],
        POOL_TOKEN_AMOUNT,
    );

    console.log('Withdrawing pool tokens for A and B tokens');
    await tokenSwap.withdrawAllTokenTypes(
        wallet,
        userAccountGENS,
        userAccountHGEN,
        tokenAccountPool,
        userTransferAuthority,
        POOL_TOKEN_AMOUNT,
        tokenA,
        tokenB,
    );

    //const poolMintInfo = await tokenPool.getMintInfo();
    swapTokenA = await GENS.getAccountInfo(tokenAccountGENS);
    swapTokenB = await HGEN.getAccountInfo(tokenAccountHGEN);

    let info = await tokenPool.getAccountInfo(tokenAccountPool);
    assert(
        info.amount.toNumber() == DEFAULT_POOL_TOKEN_AMOUNT - POOL_TOKEN_AMOUNT,
    );
    assert(swapTokenA.amount.toNumber() == currentSwapTokenA - tokenA);
    currentSwapTokenA -= tokenA;
    assert(swapTokenB.amount.toNumber() == currentSwapTokenB - tokenB);
    currentSwapTokenB -= tokenB;
    info = await GENS.getAccountInfo(userAccountGENS);
    assert(info.amount.toNumber() == tokenA);
    info = await HGEN.getAccountInfo(userAccountHGEN);
    assert(info.amount.toNumber() == tokenB);
    info = await tokenPool.getAccountInfo(feeAccount);
    assert(info.amount.toNumber() == feeAmount);
    currentFeeAmount = feeAmount;
}

export async function createAccountAndSwapAtomic(
    wallet: Wallet
): Promise<void> {
    console.log('Creating swap token GENS account');
    let userAccountGENS = await GENS.createAccount(owner.publicKey);
    await GENS.mintTo(userAccountGENS, owner, [], SWAP_AMOUNT_IN);

    // @ts-ignore
    const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
        connection,
    );
    const newAccount = new Account();
    const transaction = new Transaction();
    transaction.add(
        SystemProgram.createAccount({
            fromPubkey: owner.publicKey,
            newAccountPubkey: newAccount.publicKey,
            lamports: balanceNeeded,
            space: AccountLayout.span,
            programId: HGEN.programId,
        }),
    );

    transaction.add(
        Token.createInitAccountInstruction(
            HGEN.programId,
            HGEN.publicKey,
            newAccount.publicKey,
            owner.publicKey,
        ),
    );

    const userTransferAuthority = new Account();
    transaction.add(
        Token.createApproveInstruction(
            GENS.programId,
            userAccountGENS,
            userTransferAuthority.publicKey,
            owner.publicKey,
            [owner],
            SWAP_AMOUNT_IN,
        ),
    );

    transaction.add(
        TokenSwap.swapInstruction(
            tokenSwap.tokenSwap,
            tokenSwap.authority,
            userTransferAuthority.publicKey,
            userAccountGENS,
            tokenSwap.tokenAccountA,
            tokenSwap.tokenAccountB,
            newAccount.publicKey,
            tokenSwap.poolToken,
            tokenSwap.feeAccount,
            null,
            tokenSwap.swapProgramId,
            tokenSwap.tokenProgramId,
            SWAP_AMOUNT_IN,
            0,
        ),
    );

    // Send the instructions
    console.log('sending big instruction');
    await sendAndConfirmTransaction(
        'create account, approve transfer, swap',
        wallet,
        connection,
        transaction,
        owner,
        newAccount,
        userTransferAuthority,
    );

    let info;
    info = await GENS.getAccountInfo(tokenAccountGENS);
    currentSwapTokenA = info.amount.toNumber();
    info = await HGEN.getAccountInfo(tokenAccountHGEN);
    currentSwapTokenB = info.amount.toNumber();
}

export async function swap(
    wallet: Wallet
): Promise<void> {
    let check_gens = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: GENS.publicKey,
    });
    let genATA = check_gens.value[0] ? check_gens.value[0].pubkey.toBase58() : "";

    let check_hgen = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: HGEN.publicKey,
    });
    let hgenATA = check_hgen.value[0] ? check_hgen.value[0].pubkey.toBase58() : "";

    console.log('Creating swap token GENS account');
    // TODO only for testing
    if (hgenATA == "")
        userAccountHGEN = await HGEN.createAccount(wallet.publicKey);
    // change it for testing
    // let userAccountGENS = await GENS.createAccount(wallet.publicKey);
    // await GENS.mintTo(userAccountGENS, owner, [], SWAP_AMOUNT_IN);
    const userTransferAuthority = wallet.publicKey;   // new Account();

    // TODO only for testing
    // await GENS.approve(
    //     userAccountGENS,
    //     userTransferAuthority,
    //     owner,
    //     [],
    //     SWAP_AMOUNT_IN,
    // );
    console.log('Creating swap token HGEN account');

    if (genATA == "")
        userAccountGENS = await GENS.createAccount(wallet.publicKey);
    //TODO: only for testing
    // let userAccountHGEN = await HGEN.createAccount(wallet.publicKey);

    let check_pool_token = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: tokenPool.publicKey,
    });
    let poolATA = check_pool_token.value[0] ? check_pool_token.value[0].pubkey.toBase58() : "";


    let poolAccount = SWAP_PROGRAM_OWNER_FEE_ADDRESS && !poolATA
        ? await tokenPool.createAccount(owner.publicKey)
        : tokenAccountPool
    // : null; only for testing 

    console.log('Swapping');
    await tokenSwap.swap(
        wallet,
        userAccountGENS,
        tokenAccountGENS,
        tokenAccountHGEN,
        userAccountHGEN,
        poolAccount,
        userTransferAuthority,
        SWAP_AMOUNT_IN,
        SWAP_AMOUNT_OUT,
    );

    await sleep(500);

    let info;
    info = await GENS.getAccountInfo(userAccountGENS);
    assert(info.amount.toNumber() == 0);

    info = await HGEN.getAccountInfo(userAccountHGEN);
    assert(info.amount.toNumber() == SWAP_AMOUNT_OUT);

    info = await GENS.getAccountInfo(tokenAccountGENS);
    assert(info.amount.toNumber() == currentSwapTokenA + SWAP_AMOUNT_IN);
    currentSwapTokenA += SWAP_AMOUNT_IN;

    info = await HGEN.getAccountInfo(tokenAccountHGEN);
    assert(info.amount.toNumber() == currentSwapTokenB - SWAP_AMOUNT_OUT);
    currentSwapTokenB -= SWAP_AMOUNT_OUT;

    info = await tokenPool.getAccountInfo(tokenAccountPool);
    assert(
        info.amount.toNumber() == DEFAULT_POOL_TOKEN_AMOUNT - POOL_TOKEN_AMOUNT,
    );

    info = await tokenPool.getAccountInfo(feeAccount);
    assert(info.amount.toNumber() == currentFeeAmount + OWNER_SWAP_FEE);

    if (poolAccount != null) {
        info = await tokenPool.getAccountInfo(poolAccount);
        assert(info.amount.toNumber() == HOST_SWAP_FEE);
    }
}

function tradingTokensToPoolTokens(
    sourceAmount: number,
    swapSourceAmount: number,
    poolAmount: number,
): number {
    const tradingFee =
        (sourceAmount / 2) * (TRADING_FEE_NUMERATOR / TRADING_FEE_DENOMINATOR);
    const sourceAmountPostFee = sourceAmount - tradingFee;
    const root = Math.sqrt(sourceAmountPostFee / swapSourceAmount + 1);
    return Math.floor(poolAmount * (root - 1));
}

export async function depositSingleTokenTypeExactAmountIn(
    wallet: Wallet
): Promise<void> {
    // Pool token amount to deposit on one side
    const depositAmount = 10000;

    const poolMintInfo = await tokenPool.getMintInfo();
    const supply = poolMintInfo.supply.toNumber();
    const swapTokenA = await GENS.getAccountInfo(tokenAccountGENS);
    const poolTokenA = tradingTokensToPoolTokens(
        depositAmount,
        swapTokenA.amount.toNumber(),
        supply,
    );
    const swapTokenB = await HGEN.getAccountInfo(tokenAccountHGEN);
    const poolTokenB = tradingTokensToPoolTokens(
        depositAmount,
        swapTokenB.amount.toNumber(),
        supply,
    );

    const userTransferAuthority = new Account();
    console.log('Creating depositor token GENS account');
    const userAccountGENS = await GENS.createAccount(owner.publicKey);
    await GENS.mintTo(userAccountGENS, owner, [], depositAmount);
    await GENS.approve(
        userAccountGENS,
        userTransferAuthority.publicKey,
        owner,
        [],
        depositAmount,
    );
    console.log('Creating depositor token HGEN account');
    const userAccountHGEN = await HGEN.createAccount(owner.publicKey);
    await HGEN.mintTo(userAccountHGEN, owner, [], depositAmount);
    await HGEN.approve(
        userAccountHGEN,
        userTransferAuthority.publicKey,
        owner,
        [],
        depositAmount,
    );
    console.log('Creating depositor pool token account');
    const newAccountPool = await tokenPool.createAccount(owner.publicKey);

    console.log('Depositing token GENS into swap');
    await tokenSwap.depositSingleTokenTypeExactAmountIn(
        wallet,
        userAccountGENS,
        newAccountPool,
        userTransferAuthority,
        depositAmount,
        poolTokenA,
    );

    let info;
    info = await GENS.getAccountInfo(userAccountGENS);
    assert(info.amount.toNumber() == 0);
    info = await GENS.getAccountInfo(tokenAccountGENS);
    assert(info.amount.toNumber() == currentSwapTokenA + depositAmount);
    currentSwapTokenA += depositAmount;

    console.log('Depositing token HGEN into swap');
    await tokenSwap.depositSingleTokenTypeExactAmountIn(
        wallet,
        userAccountHGEN,
        newAccountPool,
        userTransferAuthority,
        depositAmount,
        poolTokenB,
    );

    info = await HGEN.getAccountInfo(userAccountHGEN);
    assert(info.amount.toNumber() == 0);
    info = await HGEN.getAccountInfo(tokenAccountHGEN);
    assert(info.amount.toNumber() == currentSwapTokenB + depositAmount);
    currentSwapTokenB += depositAmount;
    info = await tokenPool.getAccountInfo(newAccountPool);
    assert(info.amount.toNumber() >= poolTokenA + poolTokenB);
}

export async function withdrawSingleTokenTypeExactAmountOut(
    payer: Wallet
): Promise<void> {
    // Pool token amount to withdraw on one side
    const withdrawAmount = 50000;
    const roundingAmount = 1.0001; // make math a little easier

    const poolMintInfo = await tokenPool.getMintInfo();
    const supply = poolMintInfo.supply.toNumber();

    const swapTokenA = await GENS.getAccountInfo(tokenAccountGENS);
    const swapTokenAPost = swapTokenA.amount.toNumber() - withdrawAmount;
    const poolTokenA = tradingTokensToPoolTokens(
        withdrawAmount,
        swapTokenAPost,
        supply,
    );
    let adjustedPoolTokenA = poolTokenA * roundingAmount;
    if (OWNER_WITHDRAW_FEE_NUMERATOR !== 0) {
        adjustedPoolTokenA *=
            1 + OWNER_WITHDRAW_FEE_NUMERATOR / OWNER_WITHDRAW_FEE_DENOMINATOR;
    }

    const swapTokenB = await HGEN.getAccountInfo(tokenAccountHGEN);
    const swapTokenBPost = swapTokenB.amount.toNumber() - withdrawAmount;
    const poolTokenB = tradingTokensToPoolTokens(
        withdrawAmount,
        swapTokenBPost,
        supply,
    );
    let adjustedPoolTokenB = poolTokenB * roundingAmount;
    if (OWNER_WITHDRAW_FEE_NUMERATOR !== 0) {
        adjustedPoolTokenB *=
            1 + OWNER_WITHDRAW_FEE_NUMERATOR / OWNER_WITHDRAW_FEE_DENOMINATOR;
    }

    const userTransferAuthority = new Account();
    console.log('Creating withdraw token GENS account');
    const userAccountGENS = await GENS.createAccount(owner.publicKey);
    console.log('Creating withdraw token HGEN account');
    const userAccountHGEN = await GENS.createAccount(owner.publicKey);
    console.log('Creating withdraw pool token account');
    const poolAccount = await tokenPool.getAccountInfo(tokenAccountPool);
    const poolTokenAmount = poolAccount.amount.toNumber();
    await tokenPool.approve(
        tokenAccountPool,
        userTransferAuthority.publicKey,
        owner,
        [],
        adjustedPoolTokenA + adjustedPoolTokenB,
    );

    console.log('Withdrawing token A only');
    await tokenSwap.withdrawSingleTokenTypeExactAmountOut(
        payer,
        userAccountGENS,
        tokenAccountPool,
        userTransferAuthority,
        withdrawAmount,
        adjustedPoolTokenA,
    );

    let info;
    info = await GENS.getAccountInfo(userAccountGENS);
    assert(info.amount.toNumber() == withdrawAmount);
    info = await GENS.getAccountInfo(tokenAccountGENS);
    assert(info.amount.toNumber() == currentSwapTokenA - withdrawAmount);
    currentSwapTokenA += withdrawAmount;
    info = await tokenPool.getAccountInfo(tokenAccountPool);
    assert(info.amount.toNumber() >= poolTokenAmount - adjustedPoolTokenA);

    console.log('Withdrawing token B only');
    await tokenSwap.withdrawSingleTokenTypeExactAmountOut(
        payer,
        userAccountHGEN,
        tokenAccountPool,
        userTransferAuthority,
        withdrawAmount,
        adjustedPoolTokenB,
    );

    info = await HGEN.getAccountInfo(userAccountHGEN);
    assert(info.amount.toNumber() == withdrawAmount);
    info = await HGEN.getAccountInfo(tokenAccountHGEN);
    assert(info.amount.toNumber() == currentSwapTokenB - withdrawAmount);
    currentSwapTokenB += withdrawAmount;
    info = await tokenPool.getAccountInfo(tokenAccountPool);
    assert(
        info.amount.toNumber() >=
        poolTokenAmount - adjustedPoolTokenA - adjustedPoolTokenB,
    );
}

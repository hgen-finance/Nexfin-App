import { Token, TOKEN_PROGRAM_ID, AuthorityType } from "@solana/spl-token";
import {
    Account,
    PublicKey,
    Connection,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";
import {
    TroveLayout,
    TROVE_ACCOUNT_DATA_LAYOUT,
    DEPOSIT_ACCOUNT_DATA_LAYOUT,
    DepositLayout,
    EscrowProgramIdString,
    SYS_ACCOUNT,
} from "./layout";
import Wallet from "@project-serum/sol-wallet-adapter";

// anchor
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

export const depositUtil = async (
    wallet: Wallet,
    // Адрес токена GENS
    tokenMintAccountPubkey: string,
    tokenAmount: number,
    // Адрес кошелька токена пользователя GENS
    pdaToken: string,
    // Адрес кошелька токена пользователя HGEN
    governanceToken: string,
    connection: Connection,
    escrowProgram: any,
) => {

    const escrowProgramId = new PublicKey(EscrowProgramIdString);
    const tokenMintAcc = new PublicKey(tokenMintAccountPubkey);
    const pdaTokenAcc = new PublicKey(pdaToken);
    const governanceTokenAcc = new PublicKey(governanceToken);

    // setup pda for deposit account
    const [depositAccountPDA, deposit_account_bump] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("deposit"), wallet.publicKey.toBuffer()],
        escrowProgramId
    );
    const depositAccount = depositAccountPDA;
    const depositIx = escrowProgram.instruction.borrow(new anchor.BN(tokenAmount), new anchor.BN(deposit_account_bump),
        {
            accounts: {
                authority: wallet.publicKey,
                depositAccount: depositAccount,
                rent: SYSVAR_RENT_PUBKEY,
                tokenProgram: TOKEN_PROGRAM_ID,
                userToken: pdaTokenAcc,
                userGovToken: governanceTokenAcc,
                tokenMint: tokenMintAcc,
                SystemProgram: SystemProgram.programId,
            }
        },
    );

    const tx = new Transaction().add(depositIx);

    // добавляем данне для возможност формирования подписи
    let { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    // to sign
    let signedTx = await wallet.signTransaction(tx);
    let txId = await connection.sendRawTransaction(signedTx.serialize());

    // Info
    const encodedDepositAccount = (await connection.getAccountInfo(
        depositAccount,
        "singleGossip"
    ))!.data;
    const decodedDepositState = DEPOSIT_ACCOUNT_DATA_LAYOUT.decode(
        encodedDepositAccount
    ) as DepositLayout;

    return {
        txId,
        depositAccountPubkey: depositAccount.toBase58(),
        isInitialized: !!decodedDepositState.isInitialized,
        tokenAmount: new BN(decodedDepositState.tokenAmount, 10, "le").toNumber(),
        rewardTokenAmount: new BN(
            decodedDepositState.rewardTokenAmount,
            10,
            "le"
        ).toNumber(),
        rewardGovernanceTokenAmount: new BN(
            decodedDepositState.rewardGovernanceTokenAmount,
            10,
            "le"
        ).toNumber(),
        rewardCoinAmount: new BN(
            decodedDepositState.rewardCoinAmount,
            10,
            "le"
        ).toNumber(),
        owner: new PublicKey(decodedDepositState.owner).toBase58(),
    };
};

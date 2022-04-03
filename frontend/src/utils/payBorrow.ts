import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
    Account,
    Connection,
    PublicKey,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";
import {
    TroveLayout,
    TROVE_ACCOUNT_DATA_LAYOUT,
    EscrowProgramIdString,
    CHAINLINK_SOL_USD_PUBKEY,
    SYS_ACCOUNT,
} from "./layout";
import Wallet from "@project-serum/sol-wallet-adapter";

const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

export const payBorrowUtil = async (
    wallet: Wallet,
    //gens token address
    tokenMintAccountPubkey: string,
    troveId: string,
    //wallet address of the user gens token
    pdaToken: string,
    amount: number,
    lamports: number,
    connection: Connection,
    escrowProgram: any,
) => {
    const escrowProgramId = new PublicKey(EscrowProgramIdString);
    const troveAccount = new PublicKey(troveId);
    const tokenMintAcc = new PublicKey(tokenMintAccountPubkey);
    const pdaTokenAcc = new PublicKey(pdaToken);

    let payBorrowIx;
    let transferSolIx;
    try {
        payBorrowIx = escrowProgram.instruction.updateTrove(new anchor.BN(amount),
            {
                accounts: {
                    authority: wallet.publicKey,
                    trove: troveAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    userToken: pdaTokenAcc,
                    tokenMint: tokenMintAcc,
                },
            },
        );

        // transferSolIx = escrowProgram.instruction.withdrawCoin(new anchor.BN(lamports),
        //     {
        //         accounts: {
        //             authority: wallet.publicKey,
        //             trove: troveAccount,
        //             systemProgram: SystemProgram.programId
        //         },
        //     },
        // );
    } catch (err) {
        console.error(err, "Anchor error")
    }

    const tx = new Transaction().add(payBorrowIx);

    // добавляем данне для возможност формирования подписи
    let { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    // to sign
    let signedTx = await wallet.signTransaction(tx);
    let txId = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(txId);

    return {
        troveAccountPubkey: troveAccount.toBase58(),
        txId
    };
};

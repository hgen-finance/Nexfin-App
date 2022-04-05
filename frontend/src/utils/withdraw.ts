import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
    Account,
    Connection,
    PublicKey,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction,
    Keypair,
} from "@solana/web3.js";
import BN from "bn.js";
import * as bs58 from "bs58";

import {
    DEPOSIT_ACCOUNT_DATA_LAYOUT,
    DepositLayout,
    EscrowProgramIdString,
    SYS_ACCOUNT,
    TOKEN_GENS,
} from "./layout";
import Wallet from "@project-serum/sol-wallet-adapter";

// anchor
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

export const withdrawUtil = async (
    wallet: Wallet,
    depositId: string,
    tokenMintAccountPubkey: string,
    tokenAmount: number,
    pdaToken: string,
    connection: Connection,
    escrowProgram: any,
) => {
    const depositAccount = new PublicKey(depositId);
    const escrowProgramId = new PublicKey(EscrowProgramIdString);
    const gens_mint_addr = new PublicKey(tokenMintAccountPubkey);
    const pdaTokenAcc = new PublicKey(pdaToken);
    // const governanceTokenAcc = new PublicKey(governanceToken);

    // setup pda for minting
    const [pda_mint, bump_mint] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("mint-authority")],
        escrowProgramId
    );
    console.log(`bump: ${bump_mint}, pubkey: ${pda_mint.toBase58()}`);

    // setup pda for deposit account
    const [_depositAccountPDA, deposit_account_bump] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("deposit"), wallet.publicKey.toBuffer()],
        escrowProgramId
    );

    // get the token account info of the wallet
    let GENS = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: new PublicKey(TOKEN_GENS),
    });
    let tokenADA = GENS.value[0] ? GENS.value[0].pubkey.toBase58() : "";

    let withdrawIx
    try {
        withdrawIx = escrowProgram.instruction.withdrawDeposit(new anchor.BN(tokenAmount), new anchor.BN(bump_mint), new anchor.BN(deposit_account_bump), {
            accounts: {
                authority: wallet.publicKey,
                deposit: depositAccount,
                tokenAuthority: pda_mint,
                stableCoin: gens_mint_addr,
                userToken: new PublicKey(tokenADA),
                tokenProgram: TOKEN_PROGRAM_ID,
            }
        })
    } catch (err) {
        console.error(err)
    }

    const tx = new Transaction().add(withdrawIx);
    console.log("the transaction is ", tx);

    let { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    // to sign
    let signedTx = await wallet.signTransaction(tx);
    let txId = await connection.sendRawTransaction(signedTx.serialize());

    return {
        txId,
        depositAccountPubkey: depositAccount.toBase58(),

    };
};

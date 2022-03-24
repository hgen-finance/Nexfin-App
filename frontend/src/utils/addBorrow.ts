import {
    Account,
    PublicKey,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    Connection,
} from "@solana/web3.js";
import BN from "bn.js";

import {
    TroveLayout,
    TROVE_ACCOUNT_DATA_LAYOUT,
    EscrowProgramIdString,
    CHAINLINK_SOL_USD_PUBKEY,
    TOKEN_GENS_ACC,
    SYS_ACCOUNT,
    TOKEN_GENS,
    PYTH_SOL_USD_PUBKEY
} from "./layout";
import { TOKEN_PROGRAM_ID, Token, AuthorityType } from "@solana/spl-token";
import Wallet from "@project-serum/sol-wallet-adapter";

// anchor
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

export const addBorrowUtil = async (
    wallet: Wallet,
    troveId: string,
    borrowAmount: number,
    lamportAmount: number,
    connection: Connection,
    escrowProgram: any,
) => {
    console.log("Add borrow in process")

    // setup pda for minting
    // TODO set the seed to be wallet as well
    const [pda_mint, bump_mint] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("mint-authority")],
        new PublicKey(EscrowProgramIdString)
    );
    console.log(`bump: ${bump_mint}, pubkey: ${pda_mint.toBase58()}`);

    const escrowProgramId = new PublicKey(EscrowProgramIdString);

    // finding a program address for the trove pda
    let [troveAccountPDA, bump_trove] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("borrowertrove"), anchor.getProvider().wallet.publicKey.toBuffer()],
        escrowProgramId
    );
    console.log(`trove_bump: ${bump_mint}, pubkey: ${pda_mint.toBase58()}`)

    const troveAccount = troveAccountPDA;

    const transferIx = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: troveAccount,
        lamports: lamportAmount,
    });

    let mintPubkey = new PublicKey(TOKEN_GENS);

    const GENS = await connection.getParsedTokenAccountsByOwner(
        wallet.publicKey,
        { mint: new PublicKey(TOKEN_GENS) }
    );
    const tokenADA = GENS.value[0] ? GENS.value[0].pubkey.toBase58() : "";

    let addBorrowIx;
    try {
        addBorrowIx = escrowProgram.instruction.addBorrow(new anchor.BN(borrowAmount), new anchor.BN(lamportAmount), new anchor.BN(bump_mint),
            {
                accounts: {
                    authority: wallet.publicKey,
                    trove: troveAccount,
                    tokenAuthority: pda_mint,
                    stableCoin: mintPubkey,
                    userToken: tokenADA,
                    pythSolAccount: PYTH_SOL_USD_PUBKEY,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    rent: SYSVAR_RENT_PUBKEY,
                },
            },
        );
    } catch (err) {
        console.error(err, "anchor error");
    }

    // add instruction to the transaction
    const tx = new Transaction().add(transferIx, addBorrowIx);

    // add data for signature generation
    let { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    // to sign
    let signedTx = await wallet.signTransaction(tx);

    //   signedTx.partialSign(troveAccount)
    let txId = await connection.sendRawTransaction(signedTx.serialize());

    return {
        txId,
        troveAccountPubkey: troveAccount.toBase58(),
    };
};

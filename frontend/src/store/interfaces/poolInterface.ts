import { u64 } from '@solana/spl-token';
import {
    PublicKey,
} from '@solana/web3.js';

export interface Pool {
    authority: PublicKey;
    owner: PublicKey;
    payer: PublicKey;
    tokenAccountPool: PublicKey;
    feeAccount: PublicKey;
    gensMintAddr: PublicKey;
    hgenMintAddr: PublicKey;
    tokenAccountA: Number; // pool gen account amount 
    tokenAccountB: Number; // pool hgen account amount
}
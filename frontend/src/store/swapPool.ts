// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";
import { PublicKey } from "@solana/web3.js";
import { ManagerAppDepInstallRequired } from '@ledgerhq/errors';
import {
    createAccountAndSwapAtomic,
    addToken,
    createTokenSwap,
    swap,
    depositAllTokenTypes,
    withdrawAllTokenTypes,
    depositSingleTokenTypeExactAmountIn,
    withdrawSingleTokenTypeExactAmountOut,
} from '@/utils/swapPool'

import { CurveType, Numberu64 } from '@/utils/tokenSwap';
import { Pool } from '@/store/interfaces/poolInterface';

// State
export const state = () => ({
    poolInfo: {}
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
    setPool(state, newValue: Pool) {
        state.poolInfo = newValue;
    }
});

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {
        // Create token pool
        async createTokenSwapPool({ commit, dispatch, state }) {
            console.log(
                'CreateTokenSwap (constant product)',
            );
            let poolInfo = await createTokenSwap(CurveType.ConstantProduct, this.$wallet);
            commit('setPool', poolInfo);
            dispatch("onTokenAccountAChange", { authority: poolInfo.authority, tokenAccountA: poolInfo.tokenAccountA });
            dispatch("onTokenAccountBChange", { authority: poolInfo.authority, tokenAccountB: poolInfo.tokenAccountB });
            console.log(state.poolInfo)
        },

        // Add liquidity
        async depositAllToken({ commit, state }, value) {
            console.log('add liquidity for all token types');
            await depositAllTokenTypes(this.$wallet, value.tokenA, value.tokenB);
        },

        // swap tokens for the pool
        async swap() {
            console.log('swapping');
            await swap(this.$wallet);
        },

        // for adding gens and hgen tokens
        async addToken() {
            console.log("Adding GENS and HGENS")
            await addToken(this.$wallet)
        },

        // getting info for pool token A
        async getTokenAInfo({ state }, value) {
            let tokenA = await this.$web3.getParsedTokenAccountsByOwner(value.authority, { mint: value.tokenAccountA });
            console.log(tokenA, "tokenA")
            return tokenA.value[0];
        },

        // getting info for pool token B
        async getTokenBInfo({ state }, value) {
            let tokenB = await this.$web3.getParsedTokenAccountsByOwner(value.authority, { mint: value.tokenAccountB });
            console.log(tokenB, "tokenB")
            return tokenB.value[0];
        },

        // subscribe for pool hgen and gen account
        // on account change for the tokenA account
        async onTokenAChange({ dispatch }, value) {
            let acc =
                this.$web3.onAccountChange(
                    new PublicKey(value.tokenAccountA),
                    () => dispatch("getTokenAInfo", { authority: value.authority, tokenAccountA: value.tokenAccountA }),
                    "confirmed"
                );
        },
        // on account change for the tokenA account
        async onTokenBChange({ dispatch }, value) {

            this.$web3.onAccountChange(
                new PublicKey(value.tokenAccountB),
                () => dispatch("getTokenBInfo", { authority: value.authority, tokenAccountB: value.tokenAccountB }),
                "confirmed"
            );
        },

    }
);

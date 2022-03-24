// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";
import { PublicKey } from "@solana/web3.js";
import { ManagerAppDepInstallRequired } from '@ledgerhq/errors';
import {
    addToken,
    createTokenSwap,
    swap,
    depositAllTokenTypes,
    withdrawAllTokenTypes,
    depositSingleTokenTypeExactAmountIn,
    withdrawSingleTokenTypeExactAmountOut,
} from '@/utils/swapPool'

import { TOKEN_A_MINT_ADDR, TOKEN_B_MINT_ADDR, POOL_AUTHORITY, TOKEN_ACC_A, TOKEN_ACC_B } from '@/utils/layout';

import { CurveType, Numberu64 } from '@/utils/tokenSwap';
import { Pool } from '@/store/interfaces/poolInterface';

// State
export const state = () => ({
    poolInfo: {},
    tokenAmountA: 0,
    tokenAmountB: 0,
    withdrawOrDeposit: true,
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
    setPool(state, newValue: Pool) {
        state.poolInfo = newValue;
    },
    setTokenAmountA(state, newValue: number) {
        state.tokenAmountA = newValue;
    },
    setTokenAmountB(state, newValue: number) {
        state.tokenAmountB = newValue;
    },
    setLiquidityState(state, newValue: boolean) {
        state.withdrawOrDeposit = newValue;
    },
});

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {
        // change liquiditity state
        async changeLiquidityState({ commit, dispatch, state }, value) {
            commit('setLiquidityState', value);
        },

        // Create token pool
        async createTokenSwapPool({ commit, dispatch, state }) {
            console.log(
                'CreateTokenSwap (constant product)',
            );
            let poolInfo: Pool = await createTokenSwap(CurveType.ConstantProduct, this.$wallet);
            commit('setPool', poolInfo);
            commit('setTokenAmountA', poolInfo.tokenAmountA / 100); // 2 decimal 
            commit('setTokenAmountB', poolInfo.tokenAmountB / 100); // 2 decimal 
            dispatch("onTokenAChange", { authority: poolInfo.authority, tokenAccountA: poolInfo.tokenAccountA, tokenAMintAddr: poolInfo.tokenAMintAddr });
            dispatch("onTokenBChange", { authority: poolInfo.authority, tokenAccountB: poolInfo.tokenAccountB, tokenBMintAddr: poolInfo.tokenBMintAddr });
        },

        // Add liquidity
        async depositAllToken({ commit, state }, value) {
            console.log('add liquidity for all token types');
            console.log(value.tokenA, value.tokenB, "token A and B")
            await depositAllTokenTypes(this.$wallet, value.from, value.to);
        },

        // Remove Liquidity
        async withdrawToken({ commit, state }, value) {
            await withdrawAllTokenTypes(this.$wallet, value);
        },

        // swap tokens for the pool
        async swap({ }, value) {
            console.log('swapping');
            await swap(this.$wallet, value);
        },

        // for adding gens and hgen tokens
        async addToken() {
            console.log("Adding GENS and HGENS")
            await addToken(this.$wallet)
        },

        // getting info for pool token A
        async getTokenAInfo({ state, commit }, value) {
            let tokenA = await this.$web3.getParsedTokenAccountsByOwner(POOL_AUTHORITY, { mint: TOKEN_A_MINT_ADDR });
            let result: number = tokenA.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            commit('setTokenAmountA', result);
        },

        // getting info for pool token B
        async getTokenBInfo({ state, commit }, value) {
            let tokenB = await this.$web3.getParsedTokenAccountsByOwner(POOL_AUTHORITY, { mint: TOKEN_B_MINT_ADDR });
            let result: number = tokenB.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            commit('setTokenAmountB', result);
        },

        // subscribe for pool hgen and gen account
        // on account change for the tokenA account
        // TODO: set timeout on account change
        async onTokenAChange({ dispatch }, value) {
            this.$web3.onAccountChange(
                (TOKEN_ACC_A),
                () => dispatch("swapPool/getTokenAInfo", { authority: POOL_AUTHORITY, tokenAMintAddr: TOKEN_A_MINT_ADDR }, { root: true }),
            );
        },

        // on account change for the tokenA account
        // TODO: set timeout on account change
        async onTokenBChange({ dispatch }, value) {
            this.$web3.onAccountChange(
                (TOKEN_ACC_B),
                () => dispatch("swapPool/getTokenBInfo", { authority: POOL_AUTHORITY, tokenBMintAddr: TOKEN_A_MINT_ADDR }, { root: true }),
            );
        },

    }
);

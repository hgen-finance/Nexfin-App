// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";
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


// State
export const state = () => ({

});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
});

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {
        // Create token pool
        async createTokenSwapPool({ commit, state }) {
            console.log(
                'CreateTokenSwap (constant product)',
            );
            await createTokenSwap(CurveType.ConstantProduct, this.$wallet);
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
        }

    }
);

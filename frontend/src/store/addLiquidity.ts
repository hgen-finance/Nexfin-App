// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// Import Utils
import { addLiquidityUtil } from "@/utils/addLiquidity";

// State
export const state = () => ({});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {});

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {
        // Addliquidity
        async addLiquidity({ commit }, value) {
            if (value && value.from) {
                await addLiquidityUtil(
                    this.$wallet,
                    Number(value.from),
                    value.mintFrom,
                    value.mintTo,
                    this.$web3
                );
            }
        },
    }
);

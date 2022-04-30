<template>
  <div
    class="w-100 br-6 gradient-2000 rad-fix-8 p-8-S p-20-XS shadow-purple-100"
  >
    <div class="w-100 fw-600 f-white-200 fd-r jc-sb">
      <span class="fs-8-S fs-7-M" style="align-self: center"
        >Remove Liquidity</span
      >
      <span
        class="fs-3-S fs-4-M px-1-S py-1-S px-3-XS py-3-XS f-green-500 ts-3 hv d-n-XS fsh-0"
        style="align-self: center"
        v-if="true"
        @click="changeLiquidityStateToAdd"
      >
        + Add Liquidity
      </span>
      <!-- <span
        class="fs-3-S fs-4-M px-1-S py-1-S px-3-XS py-3-XS f-green-500 ts-3 hv d-n-XS fsh-0"
        style="align-self: center"
        v-if="true"
        @click="createSwapPool"
      >
        + Create Pool
      </span> -->
      <!-- <span
        class="fs-3-S fs-4-M px-1-S py-1-S px-3-XS py-3-XS f-green-500 ts-3 hv d-n-XS fsh-0"
        style="align-self: center"
        v-if="true"
        @click="addToken"
      >
        + Add Tokens
      </span> -->
    </div>
    <div
      class="w-100 mt-2-S mt-10-XS mb-1 mcolor-700 rad-fix-2-S rad-fix-15-XS px-4-S px-10-XS"
    >
      <div
        class="w-100 fs-5-S fs-20-XS f-gray-600 pb-2-S pb-10-XS pt-3-S pt-10-XS ta-r"
      >
        Set amount you want to remove
      </div>
      <div class="w-100 pb-3-S pb-0 fd-r jc-r">
        <input
          class="w-fix-s-10min fs-6-S fs-25-XS fw-600 f-mcolor-300 br-0 oul-n white-100 ta-r"
          placeholder="0"
          v-model="from"
          maxlength="15"
          type="text"
        />
        <div class="p-a-S p-r-XS l-0 b-0 w-fix-60-S w-35-XS">
          <AmSelectbox
            v-bind:data.sync="currencyFrom"
            :update="true"
            :shadow="false"
            :padding="false"
          />
        </div>
      </div>
    </div>

    <div class="w-100 fd-r py-1-S py-5-XS">
      <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
        Slippage Tolerance
        <Hint>
          Difference on price of 2 different coins you are using in transaction
          during time it takes to complete transaction.
        </Hint>
      </div>
      <div
        class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
      >
        1 <span class="f-white-200 pl-1">%</span>
      </div>
    </div>
    <div class="w-100 fd-r py-1-S py-5-XS">
      <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
        Price Impact
        <Hint>
          If the pool is $1,000 and you sell $1 worth, thay will "impact" the
          pool 0.1%.
        </Hint>
      </div>
      <div
        class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
      >
        0.00 <span class="f-white-200 pl-1">%</span>
      </div>
    </div>
    <div class="w-100 pt-6-S pt-20-XS fd-r jc-c">
      <AmButton
        color="mcolor-100"
        bColor="mcolor-100"
        opacityEffect
        @click="confirm"
        :full="true"
      >
        REMOVE LIQUIDITY
      </AmButton>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BN from "bn.js";

import Hint from "@/components/Hint";
import { Icon, Tooltip, Button, Progress, Spin, Modal } from "ant-design-vue";

import {
  TOKEN_A_MINT_ADDR,
  TOKEN_B_MINT_ADDR,
  POOL_AUTHORITY,
  TOKEN_ACC_A,
  TOKEN_ACC_B,
  LP_TOKENS_HGEN_GENS,
  LP_TOKENS_HS,
} from "@/utils/layout";

const TOKENS = [
  {
    label: "GENS-HGEN",
    value: LP_TOKENS_HGEN_GENS.toBase58(),
  },
  {
    label: "HGEN-SOL",
    value: LP_TOKENS_HS.toBase58(),
  },
];

export default {
  components: {
    Hint,
    Icon,
    Tooltip,
    Button,
    Progress,
    Spin,
    Modal,
  },
  data() {
    return {
      tokens: TOKENS,
      from: null,
      currencyFrom: {
        theme: "default",
        value: TOKENS[0].value,
        items: TOKENS,
        colorDefault: "mcolor-700",
        colorFocus: "mcolor-700",
        colorBackground: "mcolor-700",
        colorTitle: "white-200",
      },
      tokenPoolType: "HG",
      tokenAacc: "",
      tokenBacc: "",
      tokenLP: "",
      tokenAMintAddr: "",
      tokenBMintAddr: "",
      poolAccA: "",
      poolAccB: "",
    };
  },
  computed: {
    ...mapState(["wallet", "liquidity", "url"]),
    convertLiquidityToken() {},
  },
  watch: {},
  methods: {
    changeLiquidityStateToAdd() {
      this.$accessor.swapPool.changeLiquidityState(true);
    },
    addToken() {
      this.$accessor.swapPool.addToken();
    },
    confirm() {
      if (Number(this.from) > 0) {
        this.$accessor.swapPool.withdrawToken({
          tokenLP: this.tokenLP,
          tokenAacc: this.tokenAacc,
          tokenBacc: this.tokenBacc,
          tokenAMintAddr: this.tokenAMintAddr,
          tokenBMintAddr: this.tokenBMintAddr,
          from: Number(this.from),
          tokenType: this.tokenPoolType,
        });
      }
    },
    createSwapPool() {
      this.$accessor.swapPool.createTokenSwapPool();
    },
  },
  mounted() {
    if (this.tokenPoolType == "HG") {
      this.tokenLP = LP_TOKENS_HGEN_GENS;
      this.tokenAacc = TOKEN_ACC_A;
      this.tokenBacc = TOKEN_ACC_B;
      this.tokenAMintAddr = TOKEN_A_MINT_ADDR;
      this.tokenBMintAddr = TOKEN_B_MINT_ADDR;
    }
  },
};
</script>

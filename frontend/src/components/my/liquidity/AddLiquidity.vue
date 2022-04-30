<template>
  <div
    class="w-100 br-6 gradient-2000 rad-fix-8 p-8-S p-20-XS shadow-purple-100"
  >
    <div class="w-100 fw-600 f-white-200 fd-r jc-sb">
      <span class="fs-8-S fs-7-M" style="align-self: center"
        >Add Liquidity</span
      >
      <span
        class="fs-3-S fs-4-M px-1-S py-1-S px-3-XS py-3-XS f-red-500 ts-3 hv d-n-XS fsh-0"
        style="align-self: center"
        v-if="true"
        @click="changeLiquidityStateToRemove"
      >
        - Remove Liquidity
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
        Set amount you want to add
      </div>
      <div class="w-100 pb-3-S pb-0 fd-r jc-r">
        <div class="p-a-S p-r-XS l-0 b-0 w-fix-35-S w-35-XS">
          <AmSelectbox
            v-bind:data.sync="currencyFrom"
            :update="true"
            :shadow="false"
            :padding="false"
          />
        </div>
        <input
          class="ta-r w-fix-s-10min fs-6-S fs-25-XS fw-600 f-mcolor-300 br-0 oul-n white-100"
          placeholder="0"
          v-model="from"
          maxlength="15"
          type="text"
        />
      </div>
    </div>
    <div class="cside-L cside-M cside-S cside-XS fd-r jc-c mt-8-XS mt-2-S">
      <div class="fd-r jc-c f-white-200 ai-c micon-L micon-M micon-S micon-XS">
        <Icon type="plus" :rotate="90" />
      </div>
    </div>
    <div
      class="w-100 mt-2-S mt-10-XS mb-1 mcolor-700 rad-fix-2-S rad-fix-15-XS px-4-S px-10-XS"
    >
      <div
        class="ta-r w-100 fs-5-S fs-20-XS f-gray-600 pb-2-S pb-10-XS pt-3-S pt-10-XS fd-r jc-r z-4"
      >
        Set amount you want to add
      </div>
      <div class="w-100 pb-3-S pb-0 fd-r jc-r ai-c">
        <div
          class="w-fix-s-10min fs-6-S fs-25-XS fw-600 br-0 oul-n ta-r"
          :class="{
            'f-mcolor-300': Number(to) > 0,
            'f-gray-800': Number(to) === 0,
          }"
        >
          {{ to }}
        </div>
        <div class="p-a-S p-r-XS l-0 b-0 w-fix-35-S w-35-XS">
          <AmSelectbox
            v-bind:data.sync="currencyTo"
            :update="true"
            :shadow="false"
            :padding="false"
          />
        </div>
      </div>
    </div>
    <div
      class="w-100 pt-2-S pt-15-XS ta-c fs-5-S fs-20-XS fw-500 f-white-200 pb-2-S pb-15-XS"
      v-if="currencyFrom.value === tokens[0].value"
    >
      <span> 1 HGEN ≈ {{ convertTokenA }} GENS </span>
      <Icon type="sync" class="f-white-200 ts-3 hv d-n-XS fsh-0 jc-r px-1-S" />
    </div>
    <div
      class="w-100 pt-2-S pt-15-XS ta-c fs-5-S fs-20-XS fw-500 f-white-200 pb-2-S pb-15-XS"
      v-if="currencyFrom.value === tokens[1].value"
    >
      1 GENS ≈ {{ convertTokenB }} HGEN
      <Icon type="sync" class="f-white-200 ts-3 hv d-n-XS fsh-0 px-1-S jc-r" />
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
        ADD LIQUIDITY
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
} from "@/utils/layout";

const TOKENS = [
  {
    label: "GENS",
    value: "2aNEZTF7Lw9nfYv6qQEuWDyngSrB5hbdfx35jpqwcKz8",
  },

  {
    label: "HGEN",
    value: "E2UTFZCt7iCAgaCMC3Qf7MQB73Zwjc6J1avz298tn6UC",
    // mintAddr: TOKEN_B_MINT_ADDR,
    // tokenAccgh: TOKEN_ACC_B,
    // tokenAcchs: TOKEN_ACC_HGEN_HS,
  },
  {
    label: "SOL",
    value: "So11111111111111111111111111111111111111112",
    // mintAddr: new PublicKey("So11111111111111111111111111111111111111112"),
    // tokenAcchs: TOKEN_ACC_SOL_HS,
  },
];

// TODO: Fetch these value from the pool, currently the values are hardcoded
const CONVERT_HGEN = 1;
const CONVERT_GENS = 1;

// TODO: add liquidity when choosed hgen/gens or gens/hgen
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
        name: "GENS",
        colorDefault: "mcolor-700",
        colorFocus: "mcolor-700",
        colorBackground: "mcolor-700",
        colorTitle: "white-200",
      },
      to: 0,
      currencyTo: {
        theme: "default",
        value: TOKENS[1].value,
        items: TOKENS,
        name: "HGEN",
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
    ...mapState(["wallet", "addLiquidity", "url"]),
    convertTokenB() {
      let tokenA = this.$accessor.swapPool.tokenAmountA;
      let tokenB = this.$accessor.swapPool.tokenAmountB;

      if (tokenA > tokenB) return tokenB / tokenA || 0;
      else return tokenA / tokenB || 0;
    },
    convertTokenA() {
      let tokenA = this.$accessor.swapPool.tokenAmountA;
      let tokenB = this.$accessor.swapPool.tokenAmountB;

      if (tokenB > tokenA) return tokenB / tokenA || 0;
      else return tokenA / tokenB || 0;
    },
    tokepool: {
      get: function () {
        let result;
        result = {
          lpToken: LP_TOKENS_HGEN_GENS,
          tokenAaccount: TOKEN_ACC_A,
          tokenBaccount: TOKEN_ACC_B,
        };
        return result;
      },
      set: function () {},
    },
  },
  watch: {
    currencyFrom: {
      deep: true,
      handler(val) {
        if (val.value === this.currencyTo.value) {
          this.currencyTo.value = val.items.filter(
            (item) => item.value !== val.value
          )[0].value;
        }
        this.convert();
      },
    },
    currencyTo: {
      deep: true,
      handler(val) {
        if (val.value === this.currencyFrom.value) {
          this.currencyFrom.value = val.items.filter(
            (item) => item.value !== val.value
          )[0].value;
        }
        this.convert();
      },
    },
    from(val) {
      if (val) {
        this.from = val.toString().replace(/[^+\d\.]/g, "");
        if (this.from.split(".").length > 2)
          this.from = this.from.replace(/\.(?=[^\.]*$)/, "");
        if (this.from.substr(0, 2) === "00")
          this.from = this.from.substr(1, this.from.length);

        this.convert();
      } else {
        this.to = 0;
      }
    },
  },
  methods: {
    changeLiquidityStateToRemove() {
      this.$accessor.swapPool.changeLiquidityState(false);
    },
    calculateTokenRatio() {
      let tokenRatio;

      if (this.from < 0) {
        return 0;
      }

      let tokenA = this.$accessor.swapPool.tokenAmountA;
      let tokenB = this.$accessor.swapPool.tokenAmountB;

      if (tokenA > tokenB) {
        tokenRatio = tokenA / tokenB;
      } else {
        tokenRatio = tokenB / tokenA;
      }

      return tokenRatio || 0;
    },

    setModalFunc(value) {
      if (this.loaderConnect) {
        this.$accessor.wallet.setLoaderConnect(false);
      } else {
        this.$accessor.setModal(value);
      }
    },
    convert() {
      let tokenA = this.$accessor.swapPool.tokenAmountA;
      let tokenB = this.$accessor.swapPool.tokenAmountB;

      if (this.currencyFrom.value === this.tokens[0].value && tokenA > tokenB) {
        this.to = Number(this.from) / this.calculateTokenRatio() || 0;
      } else {
        this.to = this.calculateTokenRatio() * Number(this.from) || 0;
      }
    },
    addToken() {
      this.$accessor.swapPool.addToken();
    },
    confirm() {
      if (Number(this.from) > 0) {
        this.$accessor.swapPool.depositAllToken({
          tokenLP: this.tokenLP,
          tokenAacc: this.tokenAacc,
          tokenBacc: this.tokenBacc,
          tokenAMintAddr: this.tokenAMintAddr,
          tokenBMintAddr: this.tokenBMintAddr,
          from: Number(this.from),
          to: Number(this.to),
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
    this.$accessor.swapPool.getTokenAInfo();
    this.$accessor.swapPool.getTokenBInfo();
    this.$accessor.swapPool.onTokenAChange();
    this.$accessor.swapPool.onTokenBChange();
  },
};
</script>

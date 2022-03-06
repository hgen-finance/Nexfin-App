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
      <span
        class="fs-3-S fs-4-M px-1-S py-1-S px-3-XS py-3-XS f-green-500 ts-3 hv d-n-XS fsh-0"
        style="align-self: center"
        v-if="true"
        @click="createSwapPool"
      >
        + Create Pool
      </span>
      <span
        class="fs-3-S fs-4-M px-1-S py-1-S px-3-XS py-3-XS f-green-500 ts-3 hv d-n-XS fsh-0"
        style="align-self: center"
        v-if="true"
        @click="addToken"
      >
        + Add Tokens
      </span>
    </div>
    <div
      class="w-100 mt-2-S mt-10-XS mb-1 mcolor-700 rad-fix-2-S rad-fix-15-XS px-4-S px-10-XS"
    >
      <div
        class="w-100 fs-5-S fs-20-XS f-gray-600 pb-2-S pb-10-XS pt-3-S pt-10-XS"
      >
        Set amount you want to add
      </div>
      <div class="w-100 pb-3-S pb-0 fd-r">
        <input
          class="w-fix-s-10min fs-6-S fs-25-XS fw-600 f-mcolor-300 br-0 oul-n white-100"
          placeholder="0"
          v-model="from"
          maxlength="15"
          type="text"
        />
        <div class="p-a-S p-r-XS r-0 b-0 w-fix-35-S w-35-XS">
          <AmSelectbox
            v-bind:data.sync="currencyFrom"
            :update="true"
            :shadow="false"
            :padding="false"
          />
        </div>
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
        class="w-100 fs-5-S fs-20-XS f-gray-600 pb-2-S pb-10-XS pt-3-S pt-10-XS fd-r jc-sb z-4"
      >
        <span> Set amount you want to add </span>
      </div>
      <div class="w-100 pb-3-S pb-0 fd-r jc-sb ai-c">
        <div
          class="w-fix-s-10min fs-6-S fs-25-XS fw-600 br-0 oul-n"
          :class="{
            'f-mcolor-300': Number(to) > 0,
            'f-gray-800': Number(to) === 0,
          }"
        >
          {{ to }}
        </div>
        <div class="p-a-S p-r-XS r-0 b-0 w-fix-35-S w-35-XS">
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

const TOKENS = [
  { label: "HGEN", value: "97MxeDbRgc6vYP1Sty2XdPXks3QhMD97EVYJ9pP4XcR3" },
  { label: "GENS", value: "2U3Mf4umT4CpLhhdwpfmGiktyvhdrLrNNv4z4GgsXNMe" },
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
        colorDefault: "mcolor-700",
        colorFocus: "mcolor-700",
        colorBackground: "mcolor-700",
        colorTitle: "white-200",
      },
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

      if (this.currencyFrom.value === this.tokens[1].value && tokenA > tokenB) {
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
          from: Number(this.from),
          to: Number(this.to),
        });
      }
    },
    createSwapPool() {
      this.$accessor.swapPool.createTokenSwapPool();
    },
  },
};
</script>

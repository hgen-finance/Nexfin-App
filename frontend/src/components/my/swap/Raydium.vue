<template>
  <div
    class="w-100 br-6 gradient-2000 rad-fix-8 p-8-S p-20-XS shadow-purple-100"
  >
    <div class="w-100 fw-600 f-white-200 fd-r jc-sb">
      <span v-if="raySwap" class="fs-8-S fs-7-M" style="align-self: center"
        >Raydium Swap</span
      >
      <span v-if="!raySwap" class="fs-8-S fs-7-M" style="align-self: center"
        >Swap</span
      >
      <div class="fd-r buttons">
        <!-- <Tooltip placement="bottomright">
          <Progress
            type="circle"
            :width="20"
            :stroke-width="10"
            :percent="50"
            :show-info="false"
          />
        </Tooltip> -->
        <Tooltip placement="bottomRight">
          <!-- <template slot="title">
            <div
              class="shadow-purple-100 p-2-S p-10-XS f-white-200 fs-5-S fs-20-XS mcolor-500 rad-fix-3 z-15"
            >
              <p>Program Addresses (DO NOT DEPOSIT)</p>
              <div class="swap-info">
                <div v-if="fromCoin || true" class="info">
                  <div class="symbol">{{ currencyFrom.label }}</div>
                  <div class="address">
                    {{ currencyFrom.value.substr(0, 14) }}
                    ...
                    {{
                      currencyFrom.value.substr(
                        currencyFrom.value.length - 14,
                        14
                      )
                    }}
                  </div>
                  <div class="action">
                    <Icon
                      type="copy"
                      @click="$accessor.copy(currencyFrom.value)"
                    />
                    <a
                      :href="`${url.explorer}/token/${currencyFrom.value}`"
                      target="_blank"
                    >
                      <Icon type="link" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </template> -->
          <Icon
            type="info-circle"
            :style="{ width: '40px', height: '40px' }"
            class="fd-r jc-c ai-c"
          />
        </Tooltip>
        <Tooltip>
          <Icon
            type="setting"
            :style="{ width: '40px', height: '40px' }"
            class="fd-r jc-c ai-c"
          />
        </Tooltip>
        <!-- <Tooltip>
          <Icon
            type="search"
            :style="{ width: '40px', height: '40px' }"
            class="fd-r jc-c ai-c"
          />
        </Tooltip> -->
        <Tooltip>
          <Icon
            type="switcher"
            @click="toggleSwap"
            :style="{ width: '40px', height: '40px' }"
            class="fd-r jc-c ai-c"
          />
        </Tooltip>
      </div>
    </div>
    <div
      class="w-100 mt-2-S mt-10-XS mb-1 mcolor-700 rad-fix-2-S rad-fix-15-XS px-4-S px-10-XS"
    >
      <div
        class="w-100 fs-5-S fs-20-XS f-gray-600 pb-2-S pb-10-XS pt-3-S pt-10-XS"
      >
        From
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
        <Icon type="swap" :rotate="90" @click="convert" />
      </div>
    </div>
    <div
      class="w-100 mt-2-S mt-10-XS mb-1 mcolor-700 rad-fix-2-S rad-fix-15-XS px-4-S px-10-XS"
    >
      <div
        class="w-100 fs-5-S fs-20-XS f-gray-600 pb-2-S pb-10-XS pt-3-S pt-10-XS fd-r jc-sb z-4"
      >
        <span> To </span>
        <span> Estimated </span>
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
      1 GENS ≈ {{ convertRay }} HGEN
    </div>
    <div
      class="w-100 pt-2-S pt-15-XS ta-c fs-5-S fs-20-XS fw-500 f-white-200 pb-2-S pb-15-XS"
      v-if="currencyFrom.value === tokens[1].value"
    >
      1 HGEN ≈ {{ convertSOL }} GENS
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
        Minimum Received
        <Hint>
          Your transaction will revert if there is a large, unfavourable price
          movement before it is confirmed.
        </Hint>
      </div>
      <div
        class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
        v-if="currencyFrom.value === tokens[0].value"
      >
        0.0983070000
        <span class="f-white-200 pl-1">GENS</span>
      </div>
      <div
        class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
        v-if="currencyFrom.value === tokens[1].value"
      >
        0.0983070000
        <span class="f-white-200 pl-1">HGEN</span>
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
        v-if="raySwap"
      >
        RAYDIUM SWAP
      </AmButton>
      <AmButton
        color="mcolor-100"
        bColor="mcolor-100"
        opacityEffect
        @click="confirm"
        :full="true"
        v-if="!raySwap"
      >
        SWAP
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
  TOKEN_ACC_A,
  TOKEN_ACC_B,
  LP_TOKENS_HGEN_GENS,
} from "@/utils/layout";

const POOL_TOKENS = [
  { label: "HGEN", value: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R" },
  { label: "GENS", value: "So11111111111111111111111111111111111111112" },
];

const TOKENS = [
  { label: "RAY", value: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R" },
  { label: "SOL", value: "So11111111111111111111111111111111111111112" },
];
const CONVERT_GENS = 0.10104800982233;
const CONVERT_HGEN = 9.896285951185709;

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
      raySwap: false,
      tokens: POOL_TOKENS,
      convertRay: CONVERT_GENS,
      convertSOL: CONVERT_HGEN,
      from: null,
      currencyFrom: {
        theme: "default",
        value: POOL_TOKENS[0].value,
        items: POOL_TOKENS,
        colorDefault: "mcolor-700",
        colorFocus: "mcolor-700",
        colorBackground: "mcolor-700",
        colorTitle: "white-200",
      },
      to: 0,
      currencyTo: {
        theme: "default",
        value: POOL_TOKENS[1].value,
        items: POOL_TOKENS,
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
    ...mapState(["wallet", "swap", "url"]),
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
    toggleSwap() {
      this.raySwap = !this.raySwap;
    },
    setModalFunc(value) {
      if (this.loaderConnect) {
        this.$accessor.wallet.setLoaderConnect(false);
      } else {
        this.$accessor.setModal(value);
      }
    },
    calculateTokenGensToHgen() {
      let swapTokenBWithFees;
      if (this.from > 0) {
        const TRADE_FEE_NUMBERATOR = 25;
        const TRADE_FEE_DENOMINATOR = 10000;
        const OWNER_FEE_NUMBERATOR = 5;
        const OWNER_FEE_DENOMINATOR = 10000;
        let tokenA = new BN(this.$accessor.swapPool.tokenAmountA).mul(
          new BN(100)
        );
        let tokenB = new BN(this.$accessor.swapPool.tokenAmountB).mul(
          new BN(100)
        );
        console.log(tokenA, "tokenA");
        console.log(tokenB, "tokenB");
        let invariant = tokenA.mul(new BN(tokenB));
        let numerator = invariant;
        let denominator = tokenA.add(new BN(this.from).mul(new BN(100)));
        console.log(numerator.toString(), "numerator");
        console.log(denominator.toString(), "denominator");

        // new swap price for the token A->B
        let swapTokenB = numerator.div(denominator);
        swapTokenB = tokenB.sub(swapTokenB);
        console.log(swapTokenB.toString(), "swap value for token B");

        // swaptokenB with fees
        let trade_fees = new BN(TRADE_FEE_NUMBERATOR)
          .mul(swapTokenB)
          .div(new BN(TRADE_FEE_DENOMINATOR));
        let owner_fees = new BN(OWNER_FEE_NUMBERATOR)
          .mul(swapTokenB)
          .div(new BN(OWNER_FEE_DENOMINATOR));
        let swap_fees = trade_fees.add(owner_fees);
        swapTokenBWithFees = swapTokenB.sub(swap_fees);
        console.log(swapTokenBWithFees.toString(), "swap token B with fees");
      }

      return swapTokenBWithFees / 100 || 0; // 2 decimal
    },
    calculateTokenHgenToGens() {
      const TRADE_FEE_NUMBERATOR = 25;
      const TRADE_FEE_DENOMINATOR = 10000;
      const OWNER_FEE_NUMBERATOR = 5;
      const OWNER_FEE_DENOMINATOR = 10000;
      let tokenA = this.$accessor.swapPool.tokenAmountA * 100;
      let tokenB = this.$accessor.swapPool.tokenAmountB * 100;
      let invariant = new BN(tokenA).mul(new BN(tokenB));
      let numerator = invariant;
      let denominator = new BN(tokenB).add(new BN(100));

      // new swap price for the token A->B
      let swapTokenA = new BN(tokenA).sub(numerator).div(denominator);
      console.log(swapTokenA.toString(), "swap value for token B");

      // swaptokenB with fees
      let trade_fees = new BN(TRADE_FEE_NUMBERATOR)
        .mul(new BN(swapTokenA))
        .div(new BN(TRADE_FEE_DENOMINATOR));
      let owner_fees = new BN(OWNER_FEE_NUMBERATOR)
        .mul(new BN(swapTokenA))
        .div(new BN(OWNER_FEE_DENOMINATOR));
      let swap_fees = trade_fees.add(owner_fees);
      console.log(swap_fees, "swapfee");
      let swapTokenAWithFees = swapTokenA.sub(swap_fees);
      console.log(swapTokenAWithFees.toString(), "swap token B with fees");
      return swapTokenAWithFees; // 2 decimal
    },
    convert() {
      if (this.currencyFrom.value === this.tokens[0].value) {
        // this.to = CONVERT_GENS * Number(this.from);
        this.to = this.calculateTokenGensToHgen() || 0;
      } else {
        // this.to = CONVERT_HGEN * Number(this.from);
        this.to = this.calculateTokenHgenToGens() || 0;
      }
    },
    confirm() {
      if (this.from > 0) {
        this.$accessor.swapPool.swap({
          tokenLP: this.tokenLP,
          tokenAacc: this.tokenAacc,
          tokenBacc: this.tokenBacc,
          tokenAMintAddr: this.tokenAMintAddr,
          tokenBMintAddr: this.tokenBMintAddr,
          from: Number(this.from) * 100,
          tokenType: this.tokenPoolType,
        }); // 2 decimal
      }
      this.to = null;
      this.from = null;
    },
    rayConfirm() {
      if (Number(this.from) > 0) {
        this.$accessor.swap.swap({
          from: this.from,
          mintFrom: this.currencyFrom.value,
          mintTo: this.currencyTo.value,
        });
      }
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

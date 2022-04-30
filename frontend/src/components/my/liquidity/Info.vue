<template>
  <div class="w-100">
    <div
      class="d-n-XS w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-0-L pb-0-M pb-0-S pb-15-XS ta-l-S ta-c-XS"
    >
      <Balance />
    </div>
    <div
      class="w-100 p-4-S p-10-XS mcolor-500 rad-fix-3 bs-sb-all mt-2-S mt-10-XS mb-2-S mb-10-XS"
    >
      <div class="w-100">
        <div class="w-100 fd-c py-10-XS">
          <div
            class="w-100 fs-5-S fs-20-XS f-gray-500 pt-1-S mb-2-S pb-5-XS ta-c-XS jc-c-XS fd-r jc-l rad-fix-3"
          >
            <div class="fd-r ai-c">
              <span class="fw-600"
                ><img
                  src="@/assets/svg/symbol-gens.png"
                  class="h-fix-10-S h-fix-55-XS mr-1"
              /></span>
            </div>
            <div class="fd-r ai-c">
              <span class="fw-600">
                <img
                  src="@/assets/svg/symbol-hgen.png"
                  class="h-fix-10-S h-fix-55-XS mr-1"
                />
              </span>
            </div>

            <span
              class="fw-600 fs-6-L fs-5-S fs-20-XS f-white-200 mr-2 ml-2 my-10-XS ml-10-XS mr-10-XS ai-c fd-r"
              >GENS-HGEN</span
            >
          </div>
          <div
            class="w-100 fs-7-L fs-7-M fs-6-S fs-40-XS fw-600 f-white-200 pb-5-M pb-6-S pb-30-XS ta-l-S ta-c-XS fd-r"
          >
            Liquidity Pool
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            TOTAL LP SUPPLY
            <Hint> LP token total supply </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            {{ lpTotalSupply }}
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            TOTAL HGEN
            <Hint> HGEN liquidity in the pool </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            {{ getPoolInfo.tokenAmountB }}
            <span class="f-white-200 pl-1">HGEN</span>
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            TOTAL GENS
            <Hint> GENS liquidity in the pool </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            {{ getPoolInfo.tokenAmountA }}
            <span class="f-white-200 pl-1">GENS</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-100 p-4-S p-10-XS mcolor-500 rad-fix-3 bs-sb-all mt-2-S mt-10-XS mb-2-S mb-10-XS"
    >
      <div class="w-100">
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div
            class="w-100 fs-7-L fs-7-M fs-6-S fs-40-XS fw-600 f-white-200 pb-5-M pb-6-S pb-30-XS ta-l-S ta-c-XS"
          >
            Your Liquidity Pool
          </div>
        </div>
        <div class="w-100 fd-r pb-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            Your HGENS in Pool
            <Hint> Your share of HGENS in pool </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            ≈ {{ getTokenB }} <span class="f-white-200 pl-1">HGEN</span>
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            Your GENS in Pool
            <Hint> Your share of GENS in pool </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            ≈ {{ getTokenA }}<span class="f-white-200 pl-1">GENS</span>
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            LP Tokens
            <Hint> Your LP Tokens for the provided liquidity in the pool </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            {{ getMyLpToken }}
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            Pool Share
            <Hint> Your pool share percentage </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            {{ getPoolShare }}<span class="f-white-200 pl-1">%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Balance from "@/components/my/swap/Balance.vue";
import Hint from "@/components/Hint";

export default {
  components: {
    Balance,
    Hint,
  },
  layout: "my",
  data() {
    return {
      lpTokenType: "GH",
    };
  },
  computed: {
    getPoolInfo() {
      return {
        tokenAmountA: this.$accessor.swapPool.tokenAmountA || 0,
        tokenAmountB: this.$accessor.swapPool.tokenAmountB || 0,
        tokenAmountGensGS: this.$accessor.swapPool.tokenAmountGensGS || 0,
        tokenAmountSOLGS: this.$accessor.swapPool.tokenAmountSOLGS || 0,
        tokenAmountHgenHS: this.$accessor.swapPool.tokenAmountHgenHS || 0,
        tokenAmountSOLHS: this.$accessor.swapPool.tokenAmountSOLHS || 0,
      };
    },
    getTokenA() {
      return (
        (this.$accessor.liquidity.lpTokens /
          this.$accessor.liquidity.lpTotalSupply) *
        this.$accessor.swapPool.tokenAmountA *
        100
      ).toFixed(2);
    },
    getTokenB() {
      return (
        (this.$accessor.liquidity.lpTokens /
          this.$accessor.liquidity.lpTotalSupply) *
        this.$accessor.swapPool.tokenAmountB *
        100
      ).toFixed(2);
    },
    getPoolShare() {
      return (
        (this.$accessor.liquidity.lpTokens /
          this.$accessor.liquidity.lpTotalSupply) *
        100 *
        100
      ).toFixed(2);
    },
    lpTotalSupply() {
      this.$accessor.liquidity.getLPsupplyInfo(this.lpTokenType);
      return this.$accessor.liquidity.lpTotalSupply;
    },
    getMyLpToken() {
      return this.$accessor.liquidity.lpTokens;
    },
  },
  mounted() {
    this.$accessor.swapPool.getTokenAInfo();
    this.$accessor.swapPool.getTokenBInfo();
    this.$accessor.swapPool.onTokenAChange();
    this.$accessor.swapPool.onTokenBChange();

    this.$accessor.liquidity.getLpTokens();
    this.$accessor.liquidity.updateLpToken(this.lpTokenType);
  },
};
</script>

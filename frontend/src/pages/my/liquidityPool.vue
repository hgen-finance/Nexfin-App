<template>
  <div class="w-75 p-5-S p-10-XS mcolor-500 rad-fix-3 bs-sb-all">
    <div class="w-a-S w-100-XS fsh-0 pt-6-XS">
      <AmButton
        :height="false"
        color="mcolor-100"
        bColor="mcolor-100"
        opacityEffect
        class="py-2"
        @click="test"
      >
        REFRESH
      </AmButton>
    </div>
    <div class="w-100 fd-r ai-s">
      <div class="w-100 fd-r ai-s">
        <div
          class="d-i fs-5 f-white-200 ta-c px-1 py-2 br-r-4 br-mcolor-400 fd-r ai-c jc-c w-100"
          v-for="(header, h) in headers"
          :key="h"
        >
          <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-600">
            {{ header }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-100 fd-r ai-s br-t-4 br-mcolor-400"
      v-for="(pool, p) in getPoolInfo"
      :key="p"
    >
      <div
        class="d-i fs-5 ta-c px-1 py-4 br-r-4 br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400"
      >
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">HGEN-GENS</div>
      </div>
      <div
        class="d-i fs-5 ta-c px-1 py-4 br-r-4 br-mcolor-400 fd-r ai-c jc-c w-100 f-mcolor-300"
      >
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ pool.tokenAccountA || 0 }}
        </div>
      </div>
      <div
        class="d-i fs-5 ta-c px-1 py-4 br-r-4 br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400"
      >
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ pool.tokenAccountA || 0 }}
        </div>
      </div>
      <div
        class="d-i fs-5 ta-c px-1 py-4 br-r-4 br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400"
      >
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ pool.tokenAccountA + pool.tokenAccountB || 0 }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
import { mapState } from "vuex";

export default {
  components: {
    Loading,
  },
  layout: "my",
  computed: {
    getPoolInfo() {
      return [this.$accessor.swapPool.poolInfo];
    },
  },
  data() {
    return {
      headers: ["Pool name", "Token A", "Token B", "Liquidity"],
    };
  },
  watch: {},
  methods: {
    test() {
      console.log(this.getPoolInfo, "Pool info");
    },
  },
  mounted() {},
};
</script>

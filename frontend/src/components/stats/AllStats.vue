<template>
  <div class="w-100">
    <!-- <div v-if="true">
      <div
        class="w-100 h-100 fd-c ai-c jc-c ta-c fw-600 fs-5-S f-gray-500 mt-4-S"
      >
        No records to display
      </div>
    </div> -->
    <TotalAssets />
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import { Icon, Tooltip, Button, Progress, Spin, Modal } from "ant-design-vue";

import TotalAssets from "@/components/stats/TotalAssets.vue";

export default {
  components: {
    Loading,
    Tooltip,
    Icon,
    TotalAssets,
  },
  layout: "my",
  computed: {},
  data() {
    return {};
  },
  watch: {},
  methods: {},
  mounted() {},
};
</script>
<style scoped>
.ft-h {
  height: fit-content;
}

.inner {
  border: 3px solid #151441;
}

.select-pool:hover {
  background: rgba(18, 17, 45, 1);
  transition: ease-in 300ms;
}
</style>

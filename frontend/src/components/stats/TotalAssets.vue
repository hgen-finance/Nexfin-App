<template>
  <div class="w-100 d-b-XS mr-10-S fd-r jc-sb">
    <div class="w-48 p-4-S p-10-XS rad-fix-3 border-purple pt-5-S pt-10-XS">
      <div
        class="w-100 f-mcolor-300 fw-800 fs-8-S fs-30-XS ta-l pt-20-XS pb-1-S pb-3-XS"
      >
        <span class="f-white-200 pr-3">$</span>{{ getTotalDeposit }}
      </div>
      <div
        class="w-100 f-white-200 fw-400 fs-4-S fs-20-XS ta-l pb-5-S pb-10-XS"
      >
        Total Deposited Value (Total Value Locked)
      </div>
    </div>
    <div
      class="w-48 p-4-S p-10-XS rad-fix-3 border-purple bs-sb-all pt-5-S pt-10-XS"
    >
      <div
        class="w-100 f-mcolor-300 fw-800 fs-8-S fs-30-XS ta-l pt-20-XS pb-1-S pb-3-XS"
      >
        <span class="f-white-200 pr-3">$</span>{{ getTotalBorrow }}
      </div>
      <div
        class="w-100 f-white-200 fw-400 fs-4-S fs-20-XS ta-l pb-5-S pb-10-XS"
      >
        Total Borrowed Value
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  layout: "my",
  data() {
    return {};
  },
  computed: {
    getTotalDeposit() {
      let res = "000000000000";
      const total = Number(this.$accessor.troveTotal);
      if (total) {
        if (total > 999999999999) {
          res = 999999999999;
        } else {
          res = res.substr(0, res.length - total.toString().length) + total;
        }
      }
      return res.toString().replace(/(.)(?=(\d{3})+$)/g, "$1,");
    },
    getTotalBorrow() {
      let res = "000000000000";
      const total = Number(this.$accessor.troveTotal);
      if (total) {
        if (total > 999999999999) {
          res = 999999999999;
        } else {
          res = res.substr(0, res.length - total.toString().length) + total;
        }
      }
      return res.toString().replace(/(.)(?=(\d{3})+$)/g, "$1,");
    },
  },
  methods: {},
  mounted() {},
};
</script>
<style scoped>
.border-purple {
  border: 1px solid rgb(152, 15, 138);
}
</style>

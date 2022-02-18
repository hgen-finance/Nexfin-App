<template>
  <div class="w-100 ovh-h">
    <div class="w-100 d-n-S d-b-XS">
      <Balance />
    </div>
    <div class="w-100 fd-r-S fd-c-XS jc-se">
      <div class="w-35-S w-100-XS pt-0-S pt-30-XS">
        <AddLiquidity />
      </div>
      <div class="w-25-S w-100-XS pt-30-XS">
        <Info />
      </div>
    </div>
  </div>
</template>

<script>
import Balance from "@/components/my/Balance.vue";
import AddLiquidity from "@/components/my/addLiquidity/AddLiquidity.vue";
import Info from "@/components/my/addLiquidity/Info.vue";

export default {
  layout: "my",
  head() {
    return {
      bodyAttrs: {
        class: "isLiquidity",
      },
    };
  },
  components: {
    AddLiquidity,
    Balance,
    Info,
  },
  methods: {
    AddFunc() {},
  },
};
</script>

<style lang="scss">
.isLiquidity .liquidity-bg {
  background-image: url("/img/XMLID.png");
  background-repeat: no-repeat;
  background-position: left bottom;
  background-size: 320px;
}
</style>

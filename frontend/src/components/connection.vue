<template>
  <div class="w-100 fd-r jc-r">
    <span
      class="fs-3-S fs-4-M px-1-S fw-600 py-1-S px-3-XS py-3-XS f-green-500 ts-3 hv d-n-XS fsh-0"
      style="align-self: center"
      v-if="true"
      @click="addSol"
    >
      + Add SOL
    </span>
    <div
      class="f-white-200 jc-r mx-10-S mx-10-XS"
      v-if="expand"
      style="align-self: center"
    >
      Devnet
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      expand: true,
    };
  },
  computed: {},
  watch: {},
  methods: {
    addSol() {
      try {
        console.log("Adding SOL....");
        this.$accessor.faucet.addSol();
      } catch (err) {
        console.error(err, "Failed to add SOl");
      }
    },
  },
  mounted() {},
};
</script>

// custom css for menu
<style lang="scss"></style>

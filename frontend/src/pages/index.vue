<template>
  <div class="w-90 p-5-S p-10-XS gradient-1400 rad-fix-8 bs-sb-all ft-h inner">
    <AmModal
      :show="modalSession == 'new'"
      :shadow="'bs-sb-all'"
      max="w-fix-250-S w-90-XS "
      background="gradient-7001"
      @closed="setModalFunc('old')"
    >
      <WelcomePopup @cancel="setModalFunc" max="w-fix-250-S w-90-XS" />
    </AmModal>
    <div class="w-100">
      <div class="w-100 fd-r jc-sb ai-c mb-3-S">
        <div class="fs-4-S f-white-200 ai-s br-mcolor-400 rad-fix-5">
          <span class="hv d-n-XS fsh-0 glow" @click="true"> Stats </span>
          <span class="hv d-n-XS fsh-0" @click="true"> Transactions </span>
        </div>
      </div>
    </div>
    <all-stats />
  </div>
</template>

<script>
import Current from "@/components/my/index/Current";
import Farming from "@/components/my/index/Farming";
import Borrowing from "@/components/my/index/Borrowing";
import Pool from "@/components/my/index/Pool";
import Balance from "@/components/my/Balance.vue";
import WelcomePopup from "../components/modals/WelcomePopup.vue";
import AllStats from "@/components/stats/AllStats.vue";

export default {
  components: {
    Current,
    Farming,
    Borrowing,
    Pool,
    Balance,
    WelcomePopup,
    AllStats,
    AllStats,
  },
  layout: "my",
  data() {
    return {
      modalSession: "",
    };
  },
  computed: {
    getTotal() {
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
  methods: {
    modal() {
      if (this.$cookie.get("user") == "old") {
        this.$accessor.checkSession(true);
      } else {
        this.$accessor.checkSession(false);
        this.$cookie.set("user", "old", { expires: "1Y" });
      }
      return this.$accessor.session;
    },
    setModalFunc(value) {
      this.$accessor.setSession(value);
      this.modalSession = value;
      console.log(this.$accessor.session);
      console.log(value, "test");
    },
  },
  mounted() {
    this.modalSession = this.modal();
    // console.log(this.modalSession, "checking");
    // console.log(this.$cookie.get("user"), "Cookie");
    console.log(this.$cookie, "testin1");
  },
};
</script>

<style lang="scss" scoped>
.cards {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.card {
  position: absolute;
  //   width: 60%;
  height: 100%;
  left: 0;
  right: 0;
  margin: auto;
  transition: transform 0.4s ease;
  cursor: pointer;
}

// transforming the item box
#item-1:checked ~ .cards #card-3,
#item-2:checked ~ .cards #card-1,
#item-3:checked ~ .cards #card-2 {
  transform: translatex(-40%) scale(0.8);
  opacity: 0.4;
  z-index: 0;
}

#item-1:checked ~ .cards #card-2,
#item-2:checked ~ .cards #card-3,
#item-3:checked ~ .cards #card-1 {
  transform: translatex(40%) scale(0.8);
  opacity: 0.4;
  z-index: 0;
}

#item-1:checked ~ .cards #card-1,
#item-2:checked ~ .cards #card-2,
#item-3:checked ~ .cards #card-3 {
  transform: translatex(0) scale(1);
  box-shadow: 0 0 0.5rem #b556ff;

  opacity: 1;
  z-index: 1;
}

// hide the input type
input[type="radio"] {
  display: none;
}

.ft-h {
  height: fit-content;
}

.inner {
  border: 3px solid #4b0385;
}
</style>

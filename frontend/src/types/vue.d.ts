import { NuxtWeb3Instance } from "./web3";
import { WalletAdapter } from "@/wallets/types";
import { NuxtNotifyInstance } from "./notify";

import { accessorType } from "@/store";
import { NuxtCookieInstance } from "./cookie";

declare module "@nuxt/types" {
    interface Context {
        $web3: NuxtWeb3Instance;
        $notify: NuxtNotifyInstance;
        $cookie: NuxtCookieInstance;
        $accessor: typeof accessorType;
    }

    interface NuxtAppOptions {
        $web3: NuxtWeb3Instance;
        $accessor: typeof accessorType;
        $cookie: NuxtCookieInstance;
        $wallet: WalletAdapter | null;
    }
}

declare module "vue/types/vue" {
    interface Vue {
        $web3: NuxtWeb3Instance;
        $notify: NuxtNotifyInstance;
        $cookie: NuxtCookieInstance;
        $accessor: typeof accessorType;
        $wallet: WalletAdapter | null;
    }
}

// Vuex
declare module "vuex/types/index" {
    // eslint-disable-next-line
    interface Store<S> {
        $web3: NuxtWeb3Instance;
        $cookie: NuxtCookieInstance;
        $notify: NuxtNotifyInstance;
        $accessor: typeof accessorType;
        $wallet: WalletAdapter | null;
    }
}

import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Plugin } from "@nuxt/types";

const web3Plugin: Plugin = async (ctx, inject) => {
    const web3 = new Connection("http://localhost:8899", "confirmed");
    //   ctx.$web3 = web3
    inject("web3", web3);
    console.log(web3, "| web3 connection status");
};

export default web3Plugin;

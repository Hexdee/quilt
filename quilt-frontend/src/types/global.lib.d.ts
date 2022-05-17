import { IPFS } from "ipfs-core/src";

declare global {
  interface Window {
    ethereum: any;
  }
}

window.ipfs = window.ipfs || {};

import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const injected = new InjectedConnector();

const walletconnect = new WalletConnectConnector({
  rpc: {
    4: process.env.INFURA_KEY,
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

module.exports = { injected, walletconnect };

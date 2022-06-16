import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

const walletconnect = new WalletConnectConnector({
  rpc: {
    4: "https://rinkeby.infura.io/v3/eab02be7ce714e0c98ecb6f417d5c596",
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

module.exports = { injected, walletconnect };

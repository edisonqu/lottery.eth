import React from "react";
import styles from "../styles/ConnectWallet.module.css";
import { Button } from "web3uikit";

import { injected, walletconnect } from "../utils/connectors";
import { useWeb3React } from "@web3-react/core";

const ConnectWallet = () => {
  const { activate } = useWeb3React();

  async function connect(provider) {
    try {
      await activate(provider);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className={styles.disconnected}>
        <div className={styles.buttonWalletContainer}>
          <Button
            icon="metamask"
            text="Connect Metamask"
            onClick={() => connect(injected)}
            theme="colored"
            color="yellow"
            isFullWidth
          />
        </div>
        <div className={styles.buttonWalletContainer}>
          <Button
            text="Connect WalletConnect"
            onClick={() => connect(walletconnect)}
            theme="colored"
            color="blue"
            isFullWidth
          />
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;

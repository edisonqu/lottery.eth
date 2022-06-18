import Image from "next/image";
import styles from "../styles/WrongChainId.module.css";
import { Button } from "web3uikit";

import { useWeb3React } from "@web3-react/core";
import switchNetwork from "../utils/switchNetwork";
import { appChainId } from "../constants/contract";

const wrongChainIdGif = "/wrong-chain-id.gif";

const WrongChainId = () => {
  const { library: provider } = useWeb3React();

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Wrong chain id</h3>
      <Image src={wrongChainIdGif} width={300} height={300} />
      <div className={styles.button}>
        <Button
          icon="plus"
          text="Switch network"
          theme="colored"
          color="yellow"
          type="button"
          className={styles.button}
          onClick={() => switchNetwork(provider, appChainId)}
        />
      </div>
    </div>
  );
};

export default WrongChainId;

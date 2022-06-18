import React from "react";
import styles from "../styles/Presentation.module.css";
import { useWeb3React } from "@web3-react/core";

const Presentation = () => {
  const { active } = useWeb3React();

  return (
    <>
      <h1 className={styles.title}>Lottery</h1>
      <h3 className={styles.info}>
        {active
          ? "Your gambling time with your friends is just 1 click away!"
          : "Connect your wallet and start gambling"}
      </h3>
    </>
  );
};

export default Presentation;

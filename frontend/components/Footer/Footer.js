import React from "react";
import Image from "next/image";
const twitterLink = "/twitter-logo.svg";
import styles from "../../styles/Footer.module.css";
const etherLink = "/ethereum.svg";
const githubLink = "/github.png";
const TWITTER_HANDLE = "alan_racciatti1";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.footerContainerSmall}>
        <Image src={etherLink} alt="Ethereum logo" width={48} height={48} />
        <a
          href="https://faucets.chain.link/rinkeby"
          target="_blank"
          rel="noreferrer"
        >
          Need some fake ETH?
        </a>
      </div>
      <div className={styles.footerContainerSmall}>
        <Image src={githubLink} alt="Github logo" width={64} height={48} />
        <a
          href="https://github.com/AlanRacciatti/lottery.eth"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
      </div>
      <div className={styles.footerContainerSmall}>
        <Image src={twitterLink} alt="Twitter logo" width={48} height={48} />
        <a
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`Built by @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  );
};

export default Footer;

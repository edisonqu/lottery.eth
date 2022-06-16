import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Footer from "../components/Footer/Footer";
import { ethers } from "ethers";
import { abi, address, appChainId } from "../constants/contract";

import { useWeb3React } from "@web3-react/core";
import {
  Button,
  Hero,
  Icon,
  useNotification,
  Modal,
  Typography,
  Input,
} from "web3uikit";

import { formatTime } from "../utils/formatTime";
import { injected, walletconnect } from "../utils/connectors";

const CONTRACT_OWNER = "0xA853Ad7156aaC80A5Ff6F8dcC32146d18f01E441";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ticketImg = "/ticket.svg";

export default function Home() {
  const {
    chainId,
    account,
    activate,
    active,
    library: provider,
  } = useWeb3React();

  const [contract, setContract] = useState(null);
  const [lotteries, setLotteries] = useState([]);
  const [isCreatingLottery, setIsCreatingLottery] = useState(false);
  const [isBuyingTicket, setIsBuyingTicket] = useState(false);
  const [isDeclaringWinner, setIsDeclaringWinner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [lotteryData, setLotteryData] = useState({});

  const dispatch = useNotification();

  async function connect(provider) {
    try {
      await activate(provider);
    } catch (error) {
      console.log(error);
    }
  }

  function handleNewNotification({ type, icon, title, message, position }) {
    dispatch({
      type,
      icon,
      title,
      message,
      position: position || "topR",
    });
  }

  async function createLottery(ticketPrice, seconds) {
    try {
      setIsCreatingLottery(true);
      contract.createLottery(ticketPrice, seconds);
    } catch (error) {
      console.log(error);
      setIsCreatingLottery(false);
    }
  }

  async function participate(lotteryId, ticketPrice) {
    try {
      setIsBuyingTicket(true);
      await contract.participate(lotteryId, { value: ticketPrice });
    } catch (error) {
      console.log(error);
      setIsBuyingTicket(false);
    }
  }

  async function declareWinner(lotteryId) {
    try {
      setIsDeclaringWinner(true);
      await contract.declareWinner(lotteryId);
    } catch (error) {
      console.log(error);
      setIsDeclaringWinner(false);
    }
  }

  async function updateLotteries() {
    if (active) {
      try {
        let lotteries = await contract.getLotteries();
        setLotteries(lotteries);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function switchToAppNetwork() {
    try {
      // parse to non-zero hexadecimal string
      let appChainIdHex = ethers.utils.hexValue(appChainId);
      await provider.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: appChainIdHex }],
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleLotteryInputChange(value, name) {
    setLotteryData({ ...lotteryData, [name]: +value });
  }

  function handleModalOk() {
    let { ticketPrice, days, hours, minutes } = lotteryData;

    if (!ticketPrice || !days || !hours || !minutes)
      return alert("Please fill all fields!");

    setIsModalOpen(false);

    ticketPrice = ethers.utils.parseEther(lotteryData.ticketPrice.toString());
    let seconds =
      lotteryData.days * 24 * 60 * 60 +
      lotteryData.hours * 60 * 60 +
      lotteryData.minutes * 60;

    createLottery(ticketPrice, seconds);
  }

  useEffect(() => {
    if (active) {
      if (chainId !== appChainId) switchToAppNetwork();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, abi, signer);
      setContract(contract);
    }
  }, [active, provider, chainId]);

  useEffect(() => {
    if (active) {
      updateLotteries();

      contract.on(
        "LotteryCreated",
        (lotteryId, ticketPrice, prize, endDate) => {
          lotteryId = parseInt(lotteryId);
          updateLotteries();
          handleNewNotification({
            type: "Success",
            title: "Lottery Created",
            message: `Lottery ${lotteryId + 1} created successfully`,
          });

          setIsCreatingLottery(false);
        }
      );

      contract.on("PrizeIncreased", (lotteryId, lotteryPrize) => {
        setIsBuyingTicket(false);
        updateLotteries();

        let parsedLotteryId = parseInt(lotteryId);
        let parsedLotterPrize = ethers.utils.formatEther(lotteryPrize);
        handleNewNotification({
          type: "Success",
          title: "Prize Increased",
          message: `Prize of lottery ${
            parsedLotteryId + 1
          } increased to ${parsedLotterPrize}`,
        });
      });

      contract.on("WinnerDeclared", (requestId, lotteryId, winner) => {
        let parsedLotteryId = parseInt(lotteryId);

        setIsDeclaringWinner(false);
        updateLotteries();
        handleNewNotification({
          type: "Success",
          title: "Winner declared",
          message: `Address ${winner} has won the lottery ${
            parsedLotteryId + 1
          }!`,
        });
      });

      contract.on("LotteryFinished", (lotteryId, winner) => {
        let parsedLotteryId = parseInt(lotteryId);
        let message = `Lottery ${parsedLotteryId + 1} has finished! ${
          winner === ZERO_ADDRESS
            ? "There were not participants"
            : `Winner address is ${winner}`
        }`;

        setIsDeclaringWinner(false);
        updateLotteries();
        handleNewNotification({
          type: "Success",
          title: "Lottery finished",
          message,
        });
      });
    }
  }, [contract]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Lottery</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <h1 className={styles.title}>Lottery</h1>
        <h3 className={styles.info}>
          Your gambling time with your friends is just 1 click away!
        </h3>
        {active ? (
          <>
            {account == CONTRACT_OWNER ? (
              <div className={styles.connected}>
                <Button
                  icon="plus"
                  text="Create lottery"
                  theme="primary"
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  loadingText="Creating lottery..."
                  isLoading={isCreatingLottery}
                  isFullWidth={true}
                />
                <Modal
                  isVisible={isModalOpen}
                  okText="Create lottery"
                  onCancel={() => setIsModalOpen(false)}
                  onCloseButtonPressed={() => setIsModalOpen(false)}
                  onOk={() => handleModalOk()}
                  title={
                    <div style={{ display: "flex", gap: 10 }}>
                      <Icon fill="#68738D" size={28} svg="calendar" />
                      <Typography color="#68738D" variant="h3">
                        Create lottery
                      </Typography>
                    </div>
                  }
                >
                  <div
                    style={{
                      padding: "20px 0 20px 0",
                    }}
                  >
                    <Input
                      label="Ticket price"
                      width="100%"
                      prefixIcon="eth"
                      placeholder="0.04"
                      type="number"
                      iconPosition="end"
                      onChange={(e) =>
                        handleLotteryInputChange(e.target.value, "ticketPrice")
                      }
                      style={{
                        margin: "15px 0",
                      }}
                    />
                    <Input
                      label="Days"
                      width="100%"
                      prefixIcon="atomicApi"
                      placeholder="1"
                      type="number"
                      iconPosition="end"
                      onChange={(e) =>
                        handleLotteryInputChange(e.target.value, "days")
                      }
                      style={{
                        margin: "15px 0",
                      }}
                    />
                    <Input
                      label="Hours"
                      width="100%"
                      prefixIcon="atomicApi"
                      placeholder="30"
                      type="number"
                      iconPosition="end"
                      onChange={(e) =>
                        handleLotteryInputChange(e.target.value, "hours")
                      }
                      style={{
                        margin: "15px 0",
                      }}
                    />
                    <Input
                      label="Minutes"
                      width="100%"
                      prefixIcon="atomicApi"
                      placeholder="40"
                      type="number"
                      iconPosition="end"
                      onChange={(e) =>
                        handleLotteryInputChange(e.target.value, "minutes")
                      }
                      style={{
                        margin: "15px 0",
                      }}
                    />
                  </div>
                </Modal>
              </div>
            ) : (
              <></>
            )}
            <div className={styles.lotteries}>
              {lotteries.map((lottery, i) => {
                let [
                  lotteryId,
                  participants,
                  ticketPrice,
                  prize,
                  winner,
                  isFinished,
                  endDate,
                ] = lottery;

                // parse lottery id from 0x00 to 0
                let parsedLotteryId = parseInt(lotteryId);
                console.log(parsedLotteryId + 1);
                let parsedTicketPrice = ethers.utils.formatEther(ticketPrice);
                let parsedPrize = ethers.utils.formatEther(prize);
                let parsedEndDate = formatTime(endDate);

                // Parse big number to number
                let endDateWasReached = new Date(endDate * 1000) < new Date();

                return (
                  <Hero
                    align="left"
                    className={styles.hero}
                    height="300px"
                    linearGradient="linear-gradient(113.54deg, rgba(60, 87, 140, 0.5) 14.91%, rgba(70, 86, 169, 0.5) 43.21%, rgba(125, 150, 217, 0.345) 44.27%, rgba(129, 161, 225, 0.185) 55.76%), linear-gradient(151.07deg, #141659 33.25%, #4152A7 98.24%)"
                    rounded="20px"
                    textColor="#ebebeb"
                    title={"Lottery " + (parsedLotteryId + 1)}
                    key={i}
                  >
                    <div className={styles.lotteryData}>
                      <h3 className={styles.lotteryPrize}>
                        <span>
                          Prize: <b>{parsedPrize}</b>
                        </span>
                        <Icon fill="#000000" size={16} svg="eth" />
                      </h3>
                      <div className={styles.lotteryItem}>
                        <span>
                          Ticket price: <b>{parsedTicketPrice}</b>
                        </span>
                        <Icon fill="#000000" size={16} svg="eth" />
                      </div>
                      <div className={styles.lotteryItem}>
                        <span>
                          Tickets bought: <b>{participants.length}</b>
                        </span>
                        <Image
                          src={ticketImg}
                          alt="Ticket"
                          width={32}
                          height={16}
                        ></Image>
                      </div>
                      <div className={styles.lotteryItem}>
                        <span>
                          End date: <b>{parsedEndDate}</b>
                        </span>
                      </div>
                    </div>
                    <div className={styles.buttonsContainer}>
                      <Button
                        icon="plus"
                        disabled={endDateWasReached}
                        text="Buy a ticket"
                        isLoading={isBuyingTicket}
                        loadingText="Buying ticket..."
                        onClick={() => participate(lotteryId, ticketPrice)}
                        theme="primary"
                      />
                      {account == CONTRACT_OWNER && (
                        <Button
                          disabled={isFinished || !endDateWasReached}
                          text={
                            isFinished ? "Winner declared" : "Declare winner"
                          }
                          theme={isFinished ? "translucent" : "primary"}
                          icon={isFinished ? "lockClosed" : "check"}
                          type="button"
                          isLoading={isDeclaringWinner}
                          loadingText="Declaring winner..."
                          onClick={() => declareWinner(lotteryId)}
                        />
                      )}
                    </div>
                  </Hero>
                );
              })}
            </div>
          </>
        ) : (
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
                className={styles.buttonWallet}
                isFullWidth
              />
            </div>
          </div>
        )}
      </>
      <Footer />
    </div>
  );
}

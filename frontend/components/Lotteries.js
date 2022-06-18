import { useState } from "react";
import Image from "next/image";
import styles from "../styles/Lotteries.module.css";

import { Button, Hero, Icon, Dropdown } from "web3uikit";
import SearchingLotteries from "./SearchingLotteries";
import WrongChainId from "./WrongChainId";

import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import useContract from "../hooks/useContract";
import { useNotification } from "web3uikit";

import handleNewNotification from "../utils/handleNewNotification";
import filterLotteries from "../utils/filterLotteries";
import { formatTime } from "../utils/formatTime";
import { appChainId } from "../constants/contract";

const ticketImg = "/ticket.svg";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const searchingLotteriesGif = "/searching-lotteries.gif";

const Lotteries = ({
  lotteries,
  isBuyingTicket,
  setIsBuyingTicket,
  isDeclaringWinner,
  setIsDeclaringWinner,
}) => {
  const { account, chainId } = useWeb3React();
  const contract = useContract();
  const dispatch = useNotification();
  const [lotteriesFilter, setLotteriesFilter] = useState("All");

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

  function showLotteryWinner(winner, lotteryId) {
    let noWinner = winner === ZERO_ADDRESS;

    let message = noWinner
      ? `No one participated in lottery ${lotteryId}`
      : `${winner} won the lottery ${lotteryId}`;

    handleNewNotification(dispatch, {
      type: noWinner ? "" : "success",
      icon: noWinner ? "" : "check",
      title: noWinner ? "No winner" : "Winner!",
      message,
    });
  }

  function handleDropdownChange(label) {
    setLotteriesFilter(label);
  }

  return appChainId !== chainId ? (
    <WrongChainId />
  ) : lotteries.length !== 0 ? (
    <>
      <div className={styles.dropdownContainer}>
        <div className={styles.dropdown}>
          <Dropdown
            label="Lotteries: "
            onChange={({ label }) => handleDropdownChange(label)}
            defaultOptionIndex={0}
            options={[
              {
                id: "All",
                label: "All",
              },
              {
                id: "Order by prize",
                label: "Order by prize",
              },
              {
                id: "Order by date",
                label: "Order by date",
              },
              {
                id: "Active",
                label: "Active",
              },
              {
                id: "Finished",
                label: "Finished",
              },
            ]}
          />
        </div>
      </div>
      <div className={styles.lotteries}>
        {filterLotteries(lotteries, lotteriesFilter).map((lottery, i) => {
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
                  isFullWidth
                  onClick={() => participate(lotteryId, ticketPrice)}
                  theme="primary"
                />
                <Button
                  disabled={isFinished || !endDateWasReached}
                  text={isFinished ? "Winner declared" : "Declare winner"}
                  theme={isFinished ? "translucent" : "primary"}
                  icon={isFinished ? "lockClosed" : "check"}
                  type="button"
                  isLoading={isDeclaringWinner}
                  loadingText="Declaring winner..."
                  isFullWidth
                  onClick={() => declareWinner(lotteryId)}
                />
              </div>
              <Button
                text={
                  lottery.isFinished ? "Show winner" : "Winner wasn't declared"
                }
                disabled={!lottery.isFinished}
                type="button"
                theme="colored"
                color="yellow"
                isFullWidth
                onClick={() =>
                  showLotteryWinner(lottery.winner, parsedLotteryId + 1)
                }
              />
            </Hero>
          );
        })}
      </div>
    </>
  ) : (
    <SearchingLotteries />
  );
};

export default Lotteries;

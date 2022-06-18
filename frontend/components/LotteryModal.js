import React, { useState } from "react";
import { Modal, Icon, Typography, Input } from "web3uikit";
import { ethers } from "ethers";

import useContract from "../hooks/useContract";
import { alertWarning } from "../utils/swal";

const LotteryModal = ({
  isModalOpen,
  setIsModalOpen,
  setIsCreatingLottery,
}) => {
  const contract = useContract();
  const [lotteryData, setLotteryData] = useState({});

  async function createLottery(ticketPrice, seconds) {
    try {
      setIsCreatingLottery(true);
      contract.createLottery(ticketPrice, seconds);
    } catch (error) {
      console.log(error);
      setIsCreatingLottery(false);
    }
  }

  function handleLotteryInputChange(value, name) {
    setLotteryData({ ...lotteryData, [name]: +value });
  }

  function handleModalOk() {
    let { ticketPrice, days, hours, minutes } = lotteryData;

    if (
      typeof ticketPrice !== "number" ||
      typeof days !== "number" ||
      typeof hours !== "number" ||
      typeof minutes !== "number"
    )
      return alertWarning("Please fill all fields!");

    setIsModalOpen(false);

    ticketPrice = ethers.utils.parseEther(lotteryData.ticketPrice.toString());
    let seconds =
      lotteryData.days * 24 * 60 * 60 +
      lotteryData.hours * 60 * 60 +
      lotteryData.minutes * 60;

    createLottery(ticketPrice, seconds);
  }

  return (
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
          onChange={(e) => handleLotteryInputChange(e.target.value, "days")}
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
          onChange={(e) => handleLotteryInputChange(e.target.value, "hours")}
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
          onChange={(e) => handleLotteryInputChange(e.target.value, "minutes")}
          style={{
            margin: "15px 0",
          }}
        />
      </div>
    </Modal>
  );
};

export default LotteryModal;

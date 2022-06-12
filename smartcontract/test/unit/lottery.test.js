const { expect } = require("chai");
const { ethers, getChainId, deployments } = require("hardhat");
const { config, autoFundCheck } = require("../../config/chainlink.config");

describe("LotteryGame Unit Tests", () => {
  let LotteryGame;
  let lotteryGame;
  let LinkToken;
  let linkToken;
  let chainId;
  let deployer;
  let user2;
  let user3;
  const DAY = 3600 * 24;
  before(async () => {
    [deployer, user2, user3] = await ethers.getSigners();
    chainId = await getChainId();
    await deployments.fixture(["main"]);
    LinkToken = await deployments.get("LinkToken");
    linkToken = await ethers.getContractAt("LinkToken", LinkToken.address);
    LotteryGame = await deployments.get("LotteryGame");
    lotteryGame = await ethers.getContractAt(
      "LotteryGame",
      LotteryGame.address
    );
  });
  it("Should Declare a winner", async () => {
    const networkName = config[chainId].name;
    const additionalMessage = " --linkaddress " + linkToken.address;
    if (
      await autoFundCheck(
        lotteryGame.address,
        networkName,
        linkToken.address,
        additionalMessage
      )
    ) {
      await hre.run("fund-link", {
        contract: lotteryGame.address,
        linkaddress: linkToken.address,
      });
    }

    await lotteryGame.createLottery(ethers.utils.parseEther("0.0005"), DAY * 1);
    await lotteryGame.connect(user2).participate(0, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await lotteryGame.connect(user3).participate(0, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await ethers.provider.send("evm_increaseTime", [3600 * 24 * 2]);
    const tx = await lotteryGame.declareWinner(0);
    const txReceipt = await tx.wait();
    const requestId = txReceipt.events[2].topics[1];

    // eslint-disable-next-line no-unused-expressions
    expect(requestId).to.be.not.null;
  });
  it("Should emit an event when requesting randomness", async () => {
    const networkName = config[chainId].name;
    const additionalMessage = " --linkaddress " + linkToken.address;
    if (
      await autoFundCheck(
        lotteryGame.address,
        networkName,
        linkToken.address,
        additionalMessage
      )
    ) {
      await hre.run("fund-link", {
        contract: lotteryGame.address,
        linkaddress: linkToken.address,
      });
    }

    await lotteryGame.createLottery(ethers.utils.parseEther("0.0005"), DAY * 1);
    await lotteryGame.connect(user2).participate(1, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await lotteryGame.connect(user3).participate(1, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await ethers.provider.send("evm_increaseTime", [3600 * 24 * 2]);
    await expect(lotteryGame.declareWinner(1)).to.emit(
      lotteryGame,
      "RandomnessRequested"
    );
  });
});

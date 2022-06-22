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
  it("Should NOT create Lottery is value equal to 0", async () => {
    await expect(
      lotteryGame.createLottery(ethers.utils.parseEther("0"), DAY * 5)
    ).to.be.revertedWith("Ticket price must be greater than 0");
  });
  it("Should create Lottery", async () => {
    await lotteryGame.createLottery(ethers.utils.parseEther("0.001"), DAY * 5);
    const game = await lotteryGame.getLottery(0);
    expect(game.prize).to.be.eq(ethers.utils.parseEther("0"));
    expect(game.isFinished).to.be.eq(false);
    expect(
      Math.round(
        (new Date(game.endDate * 1000).getTime() - new Date().getTime()) /
          (1000 * 3600 * 24)
      )
    ).to.be.eq(5);
  });
  it("Should NOT participate if the price is lower than the required value", async () => {
    await lotteryGame.createLottery(ethers.utils.parseEther("0.002"), DAY * 5);
    await expect(
      lotteryGame.participate(1, {
        value: ethers.utils.parseEther("0.0015"),
      })
    ).to.be.revertedWith("Value must be equal to ticket price");
  });
  it("Should NOT participate if the price is higher than the required value", async () => {
    await lotteryGame.createLottery(ethers.utils.parseEther("0.0001"), DAY * 5);
    await expect(
      lotteryGame.participate(2, {
        value: ethers.utils.parseEther("0.0002"),
      })
    ).to.be.revertedWith("Value must be equal to ticket price");
  });
  it("Should NOT participate if participation has already ended", async () => {
    await lotteryGame.createLottery(ethers.utils.parseEther("0.0001"), DAY * 5);
    await ethers.provider.send("evm_increaseTime", [3600 * 24 * 5]);
    await expect(
      lotteryGame.participate(3, {
        value: ethers.utils.parseEther("0.0001"),
      })
    ).to.be.revertedWith("Lottery participation is closed");
  });
  it("Should participate", async () => {
    await lotteryGame.createLottery(ethers.utils.parseEther("0.0005"), DAY * 1);
    await lotteryGame.connect(user2).participate(4, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await lotteryGame.connect(user3).participate(4, {
      value: ethers.utils.parseEther("0.0005"),
    });
    const game = await lotteryGame.getLottery(4);
    expect(game.participants.length).to.be.eq(2);
    expect(ethers.utils.formatEther(game.prize)).to.be.eq("0.001");
  });
  it("Should NOT declare winner if lottery still active", async () => {
    await lotteryGame.createLottery(ethers.utils.parseEther("0.0005"), DAY * 1);
    await lotteryGame.connect(user2).participate(5, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await expect(lotteryGame.declareWinner(5)).to.be.revertedWith(
      "Lottery is still active"
    );
  });
  it("Should return the funds to the player if there is only one", async () => {
    await lotteryGame.createLottery(ethers.utils.parseEther("0.0005"), DAY * 1);
    await lotteryGame.connect(user2).participate(6, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await ethers.provider.send("evm_increaseTime", [3600 * 24 * 2]);
    await expect(await lotteryGame.declareWinner(6)).to.changeEtherBalance(
      user2,
      ethers.utils.parseEther("0.0005")
    );
  });
  it("Should NOT declare the winner if missing Link funds", async () => {
    await lotteryGame.createLottery(ethers.utils.parseEther("0.0005"), DAY * 1);
    await lotteryGame.connect(user2).participate(7, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await lotteryGame.connect(user3).participate(7, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await ethers.provider.send("evm_increaseTime", [3600 * 24 * 2]);
    await expect(lotteryGame.declareWinner(7)).to.be.revertedWith(
      "Not enough LINK"
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
    await lotteryGame.connect(user2).participate(8, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await lotteryGame.connect(user3).participate(8, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await ethers.provider.send("evm_increaseTime", [3600 * 24 * 2]);
    const tx = await lotteryGame.declareWinner(8);
    const txReceipt = await tx.wait();

    const requestId = txReceipt.events[2].topics[1];
    expect(requestId).to.be.not.null;
  });
  it("Should emit an event when creating a lottery", async () => {
    await expect(
      lotteryGame.createLottery(ethers.utils.parseEther("0.001"), DAY * 1)
    ).to.emit(lotteryGame, "LotteryCreated");
  });
  it("Should emit an event when participating in a lottery", async () => {
    await lotteryGame.createLottery(ethers.utils.parseEther("0.0005"), DAY * 1);
    await expect(
      lotteryGame.connect(user2).participate(10, {
        value: ethers.utils.parseEther("0.0005"),
      })
    ).to.emit(lotteryGame, "PrizeIncreased");
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
    await lotteryGame.connect(user2).participate(11, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await lotteryGame.connect(user3).participate(11, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await ethers.provider.send("evm_increaseTime", [3600 * 24 * 2]);
    await expect(lotteryGame.declareWinner(11)).to.emit(
      lotteryGame,
      "RandomnessRequested"
    );
  });
  it("Should return the funds to the player if there is only one even if it has partcipated more than once", async () => {
    await lotteryGame.createLottery(ethers.utils.parseEther("0.0005"), DAY * 1);
    await lotteryGame.connect(user2).participate(12, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await lotteryGame.connect(user2).participate(12, {
      value: ethers.utils.parseEther("0.0005"),
    });
    await ethers.provider.send("evm_increaseTime", [3600 * 24 * 2]);
    await expect(await lotteryGame.declareWinner(12)).to.changeEtherBalance(
      user2,
      ethers.utils.parseEther("0.001")
    );
  });
  it("Should finish the lottery even if no one has participated", async () => {
    await lotteryGame.createLottery(ethers.utils.parseEther("0.0005"), DAY * 1);
    await ethers.provider.send("evm_increaseTime", [3600 * 24 * 2]);
    await lotteryGame.declareWinner(13);
    expect((await lotteryGame.getLottery(13)).isFinished).to.be.true;
  });
  it("Should emit an event when declaring winner and there's only one participant or no participants", async () => {
    await lotteryGame.createLottery(ethers.utils.parseEther("0.0005"), DAY * 1);
    await ethers.provider.send("evm_increaseTime", [3600 * 24 * 2]);
    await expect(lotteryGame.declareWinner(14)).to.emit(
      lotteryGame,
      "LotteryFinished"
    );
  });
});

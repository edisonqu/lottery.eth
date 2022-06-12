const { expect } = require("chai");
const { deployments } = require("hardhat");
describe("Lottery Integration Tests", () => {
  let LotteryGame;
  let lotteryGame;
  let chainId;
  let deployer;
  let user2;
  let user3;
  before(async () => {
    [deployer, user2, user3] = await ethers.getSigners();
    await deployments.fixture(["main"]);
    LotteryGame = await deployments.get("LotteryGame");
    lotteryGame = await ethers.getContractAt(
      "LotteryGame",
      LotteryGame.address
    );
    lotteryGame.on("WinnerDeclared", (a, b, c) => {
      console.log("Rock");
      console.log(a);
      console.log(b);
      console.log(c);
    });
  });
  it("Should receive the random number from the Oracle", async () => {
    const createLotteryTx = await lotteryGame.createLottery(
      ethers.utils.parseEther("0.0005"),
      120
    );
    await createLotteryTx.wait();
    console.log("Lottery created", new Date());
    const length = await lotteryGame.getLotteryCount();
    const lengthNumber = length.toNumber() - 1;
    console.log("Current lottery id", lengthNumber);
    const lottery = await lotteryGame.getLottery(lengthNumber);
    console.log("EndDate: ", new Date(lottery.endDate * 1000));
    const participateTx = await lotteryGame
      .connect(user2)
      .participate(lengthNumber, {
        value: ethers.utils.parseEther("0.0005"),
      });
    await participateTx.wait();
    console.log("User2 participated", new Date());
    await new Promise((resolve) => setTimeout(resolve, 120000));
    const winnerTx = await lotteryGame.declareWinner(lengthNumber);
    await winnerTx.wait();
    // Give the oracle some minutes to update the random number
    await new Promise((resolve) => setTimeout(resolve, 180000));
    const lotteryAfter = await lotteryGame.getLottery(lengthNumber);
    expect(lotteryAfter.winner).to.not.be.eq(
      "0x0000000000000000000000000000000000000000"
    );
  });
});

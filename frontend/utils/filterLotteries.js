import { ethers } from "ethers";

function filterLotteries(lotteries, filter) {
  let prizeIndex = 3;
  let isFinishedIndex = 5;
  let endDateIndex = 6;

  switch (filter) {
    case 1:
      return lotteries.slice().sort((a, b) => {
        return (
          ethers.utils.formatEther(b[prizeIndex]) -
          ethers.utils.formatEther(a[prizeIndex])
        );
      });
    case 2:
      return lotteries.slice().sort((a, b) => {
        return b[endDateIndex] * 1000 - a[endDateIndex] * 1000;
      });
    case 3:
      return lotteries.slice().filter((lottery) => !lottery[isFinishedIndex]);
    case 4:
      return lotteries.slice().filter((lottery) => lottery[isFinishedIndex]);
    default:
      return lotteries;
  }
}

export default filterLotteries;

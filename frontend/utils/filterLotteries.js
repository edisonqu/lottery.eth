import { ethers } from "ethers";

function filterLotteries(lotteries, filter) {
  let prizeIndex = 3;
  let isFinishedIndex = 5;
  let endDateIndex = 6;

  switch (filter) {
    case "Order by prize":
      return lotteries.slice().sort((a, b) => {
        return (
          ethers.utils.formatEther(b[prizeIndex]) -
          ethers.utils.formatEther(a[prizeIndex])
        );
      });
    case "Order by date":
      return lotteries.slice().sort((a, b) => {
        return b[endDateIndex] * 1000 - a[endDateIndex] * 1000;
      });
    case "Active":
      return lotteries.slice().filter((lottery) => lottery[isFinishedIndex]);
    case "Finished":
      return lotteries.slice().filter((lottery) => !lottery[isFinishedIndex]);
    default:
      return lotteries;
  }
}

export default filterLotteries;

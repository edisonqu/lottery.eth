import Image from "next/image";
import styles from "../styles/SearchingLotteries.module.css";

const searchingLotteriesGif = "/searching-lotteries.gif";

const SearchingLotteries = () => {
  return (
    <div className={styles.searchingLotteries}>
      <Image src={searchingLotteriesGif} width={300} height={300} />
      <h3>Searching lotteries...</h3>
    </div>
  );
};

export default SearchingLotteries;

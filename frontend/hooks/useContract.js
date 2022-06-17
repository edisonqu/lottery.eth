import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { address, abi, appChainId } from "../constants/contract";
import { useState, useEffect } from "react";
import switchNetwork from "../utils/switchNetwork";

function useContract() {
  const { library: provider, active, chainId } = useWeb3React();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (active) {
      if (chainId !== appChainId) switchNetwork(provider, appChainId);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, abi, signer);
      setContract(contract);
    }
  }, [active, chainId]);

  return contract;
}

export default useContract;

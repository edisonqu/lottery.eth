import { ethers } from "ethers";

async function switchNetwork(provider, chainId) {
  try {
    let chainIdHex = ethers.utils.hexValue(chainId);
    await provider.provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (error) {
    console.log(error);
  }
}
export default switchNetwork;

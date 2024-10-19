import { ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
import { DynamicContext } from "@dynamic-labs/sdk-react-core";

/**
 * @description Useful methods and data about Wallet with Dynamic Labs
 */
export const useWallet = () => {
  const { showConnectModal, hideConnectModal, isAuthenticated, user } =
    useContext(DynamicContext);
  const [ethersProvider, setEthersProvider] = useState(null);
  const [ethersSigner, setEthersSigner] = useState(null);

  // Extract wallet address from user context in Dynamic Labs
  const walletAddress = isAuthenticated ? user?.wallets?.[0]?.address : null;
  const chainCurrent = isAuthenticated ? user?.wallets?.[0]?.chainId : null;

  useEffect(() => {
    if (walletAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setEthersProvider(provider);
      setEthersSigner(signer);
    } else {
      setEthersProvider(null);
      setEthersSigner(null);
    }
  }, [walletAddress]);

  return {
    // Data
    isConnectDialogOpen: !isAuthenticated, // Dialog open if not authenticated
    walletAddress,
    walletConnectionStatus: isAuthenticated
      ? ethersSigner
        ? "connected"
        : "connecting"
      : "disconnected",
    ethersProvider,
    chainCurrent,
    ethersSigner,

    // Methods
    showConnectDialog: showConnectModal,
    closeConnectDialog: hideConnectModal,
    disconnectWallet: () => console.log("Dynamic Labs handles disconnection"),
    switchNetwork: (newChainId) => console.log(`Switch to chain ${newChainId}`), // Add network switching logic if required
  };
};

import { ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
import { DynamicContext } from "@dynamic-labs/sdk-react-core";

export const useWallet = () => {
  const { showConnectModal, hideConnectModal, isAuthenticated, user } =
    useContext(DynamicContext);
  const [ethersProvider, setEthersProvider] = useState(null);
  const [ethersSigner, setEthersSigner] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  // Extract wallet address from user context in Dynamic Labs
  const walletAddress = isAuthenticated ? user?.wallets?.[0]?.address : null;
  const chainCurrent = isAuthenticated ? user?.wallets?.[0]?.chainId : null;

  // Effect to initialize the provider and signer
  useEffect(() => {
    const initProvider = async () => {
      if (walletAddress && window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          setEthersProvider(provider);
          setEthersSigner(signer);
        } catch (error) {
          console.error("Failed to initialize provider:", error);
          setConnectionError("Failed to connect to wallet.");
        }
      } else {
        setEthersProvider(null);
        setEthersSigner(null);
      }
    };
    initProvider();
  }, [walletAddress]);

  // Method to request wallet connection
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // Optionally, you can refresh or re-fetch user data here
      } catch (error) {
        console.error("User denied account access:", error);
        setConnectionError("User denied account access.");
      }
    } else {
      setConnectionError("Please install MetaMask!");
    }
  };

  return {
    // Data
    isConnectDialogOpen: !isAuthenticated,
    walletAddress,
    walletConnectionStatus: isAuthenticated
      ? ethersSigner
        ? "connected"
        : "connecting"
      : "disconnected",
    ethersProvider,
    chainCurrent,
    ethersSigner,
    connectionError, // New error state

    // Methods
    showConnectDialog: showConnectModal,
    closeConnectDialog: hideConnectModal,
    connectWallet, // Expose connectWallet method
    disconnectWallet: () => console.log("Dynamic Labs handles disconnection"),
    switchNetwork: (newChainId) => console.log(`Switch to chain ${newChainId}`),
  };
};

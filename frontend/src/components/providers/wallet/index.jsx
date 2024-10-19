import React from "react";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const WalletProvider = ({ children }) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "ef9df390-faa4-480e-ad5f-b8f923ff8062",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      {children}
      <DynamicWidget />
    </DynamicContextProvider>
  );
};

export default WalletProvider;

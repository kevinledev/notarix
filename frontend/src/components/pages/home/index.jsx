import { useRouter } from "next/router";
import { useState } from "react";
import { Synaps } from "@synaps-io/verify-sdk";
import { useFile } from "@/components/providers/fileprovider";
import { ethers, parseUnits, Interface } from "ethers";
import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const { user, setShowAuthFlow, primaryWallet } = useDynamicContext();
  const { file, setFile } = useFile();

  const [sessionId, setSessionId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handlePayment = async () => {
    setIsLoading(true); // Start loading
    try {
      await payFee(primaryWallet); // Try to process the payment
      setPaymentCompleted(true); // Only set this if the payment succeeds
    } catch (error) {
      console.error("Payment error:", error); // Handle errors
    } finally {
      setIsLoading(false); // Stop loading in all cases
    }
  };

  // Define USDC contract ABI and NotaryPayment contract ABI
  const usdcAbi = [
    // Standard ERC-20 function to check allowance
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
  ];
  const notaryPaymentAbi = ["function payFee(uint256 amount) public"];
  const usdcAddress = "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582"; // USDC address
  const notaryPaymentAddress = "0xce730a2a1ac580f5d94da6ec03050bda37e8a5b2"; // NotaryPayment contract address

  const waitForTransactionReceipt = async (publicClient, txHash) => {
    let receipt = null;
    while (!receipt) {
      console.log("Waiting for transaction to be mined...");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
      try {
        receipt = await publicClient.getTransactionReceipt({ hash: txHash });
      } catch (error) {
        console.log("Receipt not found yet, continuing to wait...");
      }
    }
    console.log("Transaction mined:", receipt);
    return receipt;
  };

  const payFee = async (primaryWallet) => {
    if (!primaryWallet) {
      console.error("No wallet connected or wrong type");
      return;
    }

    const usdcAmount = parseUnits("0.01", 6); // Convert 0.01 USDC to correct units
    try {
      const publicClient = await primaryWallet.getPublicClient(); // For reading from the blockchain
      const walletClient = await primaryWallet.getWalletClient(); // For sending transactions
      const userAddress = primaryWallet.address; // User's address

      // Step 1: Check allowance
      const usdcInterface = new Interface(usdcAbi);
      const allowanceData = usdcInterface.encodeFunctionData("allowance", [
        userAddress,
        notaryPaymentAddress,
      ]);

      // Call the allowance function on the USDC contract
      const allowanceResult = await publicClient.call({
        to: usdcAddress,
        data: allowanceData,
      });

      // Decode the result from hex to a BigNumber
      const decodedResult = usdcInterface.decodeFunctionResult(
        "allowance",
        allowanceResult.data
      );
      const currentAllowance = ethers.toBigInt(decodedResult[0]);

      console.log("Current allowance:", currentAllowance.toString());

      // If the allowance is less than the amount needed, request approval
      if (currentAllowance < usdcAmount) {
        console.log("Allowance is insufficient, requesting approval...");
        const approveData = usdcInterface.encodeFunctionData("approve", [
          notaryPaymentAddress,
          usdcAmount,
        ]);

        const approveTx = await walletClient.sendTransaction({
          to: usdcAddress,
          data: approveData,
        });
        console.log("Approve transaction hash:", approveTx);

        // Wait for the approval transaction to be mined
        const approvalReceipt = await publicClient.getTransactionReceipt({
          hash: approveTx,
        });
        if (!approvalReceipt) {
          console.error("Approval transaction not confirmed yet");
          return;
        }
        console.log("Approval confirmed:", approvalReceipt);
      } else {
        console.log("Sufficient allowance, proceeding to payFee...");
      }

      // Step 2: Call the payFee function to send USDC
      const notaryInterface = new Interface(notaryPaymentAbi);
      const payData = notaryInterface.encodeFunctionData("payFee", [
        usdcAmount,
      ]);

      const payTx = await walletClient.sendTransaction({
        to: notaryPaymentAddress,
        data: payData,
      });

      console.log("Payment transaction hash:", payTx);

      // Wait for the payment transaction to be confirmed by polling for the receipt
      const payReceipt = await waitForTransactionReceipt(publicClient, payTx);
      console.log("Payment transaction receipt:", payReceipt);
    } catch (error) {
      console.error("Error in sending USDC:", error);
    }
  };

  const initSynapsSession = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/initSynapsSession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Session initialized:", data);

      // Initialize Synaps with the session ID from the response
      Synaps.init({
        sessionId: data.session_id, // Assuming the session ID is in the response
        onFinish: () => {
          alert("Verification finished");
          setSessionId(data.session_id);
        },
        mode: "modal",
      });

      // Show the Synaps modal
      Synaps.show();
    } catch (error) {
      console.error("Error initializing session:", error);
    } finally {
      setIsLoading(false)
    }
  };
  const handleNextPage = () => {
    initSynapsSession();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">
              Connect with an online Notary now.
            </h2>
            <p className="text-gray-600 mb-4">
              Notarize your document in minutes anytime.
            </p>
            <ul className="ml-4 text-gray-700">
              <li className="mb-2">1. Upload your document.</li>
              <li className="mb-2">2. Verify your identity.</li>
              <li className="mb-2">3. Connect your wallet.</li>
              <li className="mb-2">4. Sign on the blockchain.</li>
            </ul>
          </div>

          <div className="flex-1 bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Upload Your Document</h3>
            <Input type="file" className="mb-4" onChange={handleFileChange} />
            {isLoggedIn && user ? (
              <div className="flex flex-col gap-2 items-center">
                <DynamicWidget />
                {!sessionId && (
                  <div class="flex items-center justify-center">
                    <Button
                      className="w-auto"
                      onClick={handleNextPage}
                      disabled={!file || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Next"
                      )}
                    </Button>
                  </div>
                )}
                {sessionId && (
                  <div>
                    {!paymentCompleted ? (
                      <div className="flex flex-row items-center align-center gap-4">
                        <p className="text-sm">
                          Payment Due: <b>50 USDC</b>
                        </p>
                        <Button onClick={handlePayment} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Pay Now"
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        disabled={isLoading}
                        onClick={() => console.log("Submit documents")}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Documents"
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={() => setShowAuthFlow(true)}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

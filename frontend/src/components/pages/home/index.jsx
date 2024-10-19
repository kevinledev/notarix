import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  DynamicConnectButton,
  useDynamicContext,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { useWallet } from "@/hooks/useWallet";
import { Input } from "@/components/ui/input";

export default function Home() {
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (isLoggedIn) {
      console.log("WE DID IT");
    } else {
      console.log("nope");
    }
  }, [isLoggedIn]);

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
            <Input type="file" className="mb-4" />
            <DynamicConnectButton>
              <div className="bg-primary text-white text-center py-2 px-4 rounded-lg cursor-pointer hover:bg-primary-dark active:bg-primary-darker focus:ring-2 focus:ring-primary-light focus:outline-none">
                Submit
              </div>
            </DynamicConnectButton>
          </div>
        </div>
      </div>
    </div>
  );
}

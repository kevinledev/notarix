import { useRouter } from "next/router";
import { Synaps } from "@synaps-io/verify-sdk";
import { useFile } from "@/components/providers/fileprovider";
import {
  DynamicWidget,
  useDynamicContext,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const { user, setShowAuthFlow } = useDynamicContext();
  const [sessionId, setSessionId] = useState(null);
  const { file, setFile } = useFile();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  const initSynapsSession = async () => {
    try {
      const response = await fetch('/api/initSynapsSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Session initialized:', data);

      // Initialize Synaps with the session ID from the response
      Synaps.init({
        sessionId: data.session_id, // Assuming the session ID is in the response
        onFinish: () => {
          alert("Verification finished" );
          //  set sessionId in state
          console.log( "session id: ", data.session_id)
          setSessionId(data.session_id);

        },
        mode: "modal",
      });

      // Show the Synaps modal
      Synaps.show();
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };
  const handleNextPage = () => {
    console.log("nav to next page");
    initSynapsSession()
    router.push("/sign");
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
              <div className="flex flex-row gap-2">
                <DynamicWidget />
                <Button onClick={handleNextPage} disabled={!file}>
                  Next
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowAuthFlow(true)} disabled={!file}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

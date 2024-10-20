import { FileProvider } from "@/components/providers/fileprovider";
import WalletProvider from "@/components/providers/wallet";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <WalletProvider>
      <FileProvider>
        <Component {...pageProps} />
      </FileProvider>
    </WalletProvider>
  );
}

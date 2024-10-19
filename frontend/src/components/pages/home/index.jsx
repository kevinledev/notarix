import { useWallet } from "@/hooks/useWallet";

export default function Home() {
  const { walletConnectionStatus } = useWallet();

  return <>hello</>;
}

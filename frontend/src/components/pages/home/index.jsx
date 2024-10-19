import styles from "./styles.module.css";
import { useWallet } from "@/hooks/useWallet";

export default function Home() {
  const { walletConnectionStatus } = useWallet();

  return (
    <div className={styles.home}>
      <section className={styles.col1}>Wallet</section>

      <section className={styles.col2}>
        {walletConnectionStatus === "connected" ? "Connected" : "Not Connected"}
      </section>
    </div>
  );
}

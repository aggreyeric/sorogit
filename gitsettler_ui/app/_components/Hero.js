"use client";

import styles from "./Hero.module.css";
import { useWallet } from "@/sorobanfns/walletcontext";
import { checkConnection } from "@/sorobanfns/fns";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  const { walletAddress, setWalletAddress, isConnected, setIsConnected } =
    useWallet();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Bid on GitHub Issues and Get Paid in Crypto
      </h1>
      <p className={styles.description}>
        Join Our community and monetize your coding skills by bidding on GitHub
        issues. Get paid in crypto (XML) for your contributions!
      </p>

      <p className={styles.description}></p>

      <div className="flex gap-8">
        <button
          className={styles.cta}
          onClick={async () => {
            if (!isConnected) {
              await checkConnection();
              setIsConnected(true);
              router.push("/bids");
            } else {
              router.push("/bids");
            }
          }}
        >
          Start Bidding Now
        </button>

        <button
          className={styles.cta}
          onClick={async () => {
            if (!isConnected) {
              await checkConnection();
              setIsConnected(true);
              router.push("/issues");
              
            } else {
              router.push("/issues");
            }
          }}
        >
          Add Issue Now
        </button>
      </div>
    </div>
  );
};

export default Hero;

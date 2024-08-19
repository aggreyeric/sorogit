"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { useWallet } from "@/sorobanfns/walletcontext";
import { checkConnection } from "@/sorobanfns/fns";

const Header = () => {
  const { _, __, isConnected, setIsConnected } =
    useWallet();

  async function connectWallet() {
    await checkConnection();
    setIsConnected(true);
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          SoroGit
        </Link>
        <ul className={styles.menu}>
          <li>
            <Link href="/issues">Issues</Link>
          </li>
          <li>
            <Link href="/bids">Bid</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
        </ul>
        {isConnected ? (
        <button className={styles.connectWallet}>Wallet Connected</button>
        ): (<button onClick={connectWallet} className={styles.connectWallet}>Connect Wallet</button>)}
      </nav>
    </header>
  );
};

export default Header;

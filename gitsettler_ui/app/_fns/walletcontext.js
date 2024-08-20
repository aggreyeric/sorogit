'use client';

import { createContext, useState,useContext } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress, isConnected, setIsConnected }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
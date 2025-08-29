import { useState, useEffect, useCallback } from 'react';
import { WalletState } from '../types';

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: '0',
    isConnecting: false
  });

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this dApp');
      return false;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true }));

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        // Mock balance for demo
        const balance = '12.456';
        
        setWalletState({
          isConnected: true,
          address,
          balance,
          isConnecting: false
        });
        
        return true;
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWalletState(prev => ({ ...prev, isConnecting: false }));
    }

    return false;
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: '0',
      isConnecting: false
    });
  }, []);

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletState(prev => ({
            ...prev,
            isConnected: true,
            address: accounts[0],
            balance: '12.456' // Mock balance
          }));
        }
      });
    }
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet
  };
};

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
      removeListener: (event: string, callback: (params: any) => void) => void;
    };
  }
}
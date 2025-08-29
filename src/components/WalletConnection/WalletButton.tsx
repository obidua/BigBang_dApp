import React from 'react';
import { Wallet, Loader } from 'lucide-react';

interface WalletButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  address?: string | null;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  isConnected,
  isConnecting,
  onConnect,
  address
}) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2 bg-green-950/50 border border-emerald-500/50 rounded-lg px-3 sm:px-4 py-2 glow-green">
        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
        <span className="text-xs sm:text-sm font-medium text-emerald-300">
          {formatAddress(address)}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isConnecting}
      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base glow-blue"
    >
      {isConnecting ? (
        <>
          <Loader className="w-5 h-5 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-5 h-5" />
          Connect Wallet
        </>
      )}
    </button>
  );
};
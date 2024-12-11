'use client';

import { Wallet, ConnectWallet, WalletDropdown } from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import { useDisconnect } from 'wagmi';

export default function WalletHeader() {
  const { disconnect } = useDisconnect();

  return (
    <div className="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 shadow-sm">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        USDC Pickleball League
      </h1>
      
      <Wallet>
        <ConnectWallet>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
            <Avatar className="h-6 w-6" />
            <Name />
          </div>
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
          </Identity>
          <div className="px-4 py-2 border-t dark:border-gray-700">
            <button
              onClick={() => disconnect()}
              className="w-full text-left text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Disconnect Wallet
            </button>
          </div>
        </WalletDropdown>
      </Wallet>
    </div>
  );
} 
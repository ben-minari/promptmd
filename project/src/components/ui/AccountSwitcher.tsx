import React, { useState } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';

interface Account {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

interface AccountSwitcherProps {
  accounts: Account[];
  currentAccount: Account;
  onSwitchAccount: (account: Account) => void;
  onSignOut: () => void;
  className?: string;
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = ({
  accounts,
  currentAccount,
  onSwitchAccount,
  onSignOut,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        {currentAccount.photoURL ? (
          <img
            src={currentAccount.photoURL}
            alt={currentAccount.displayName || currentAccount.email}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
            <User size={16} className="text-teal-600" />
          </div>
        )}
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-slate-900">
            {currentAccount.displayName || currentAccount.email}
          </p>
          <p className="text-xs text-slate-500">{currentAccount.email}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500">Switch Account</p>
          </div>
          
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => {
                onSwitchAccount(account);
                setIsOpen(false);
              }}
              className={`
                w-full px-3 py-2 flex items-center space-x-3
                hover:bg-slate-50 transition-colors
                ${account.id === currentAccount.id ? 'bg-teal-50' : ''}
              `}
            >
              {account.photoURL ? (
                <img
                  src={account.photoURL}
                  alt={account.displayName || account.email}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <User size={16} className="text-teal-600" />
                </div>
              )}
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-900">
                  {account.displayName || account.email}
                </p>
                <p className="text-xs text-slate-500">{account.email}</p>
              </div>
            </button>
          ))}

          <div className="px-3 py-2 border-t border-slate-100">
            <button
              onClick={() => {
                onSignOut();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSwitcher; 
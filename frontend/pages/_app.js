import '../styles/globals.css';
import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { ChainIcon, FileTextIcon, ShieldCheckIcon, WalletIcon, CheckCircleIcon, AlertTriangleIcon } from '../components/Icons';

// Global wallet context so all pages share the same wallet state
export const WalletContext = createContext({
  address: '',
  network: '',
  isWhitelisted: null,
  connecting: false,
  connectWallet: async () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

export default function App({ Component, pageProps }) {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(null);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const addr = accounts[0] || '';
        setAddress(addr);
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setNetwork(chainId === '0xaa36a7' ? 'Sepolia' : chainId ? 'Wrong Network' : '');
        if (addr) {
          checkWhitelist(addr);
        }
      } catch {
        setAddress('');
        setNetwork('');
      }
    }
  };

  const checkWhitelist = async (addr) => {
    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ['function whitelistedIssuers(address) view returns (bool)'],
        provider
      );
      const result = await contract.whitelistedIssuers(addr);
      setIsWhitelisted(result);
    } catch {
      setIsWhitelisted(null);
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0] || '');
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setNetwork(chainId === '0xaa36a7' ? 'Sepolia' : 'Wrong Network');
      if (accounts[0]) checkWhitelist(accounts[0]);
    } catch {
      setAddress('');
      setNetwork('');
    }
    setConnecting(false);
  };

  useEffect(() => {
    checkConnection();
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', checkConnection);
      window.ethereum.on('chainChanged', checkConnection);
      return () => {
        window.ethereum.removeListener('accountsChanged', checkConnection);
        window.ethereum.removeListener('chainChanged', checkConnection);
      };
    }
  }, []);

  return (
    <WalletContext.Provider value={{ address, network, isWhitelisted, connecting, connectWallet }}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
        {/* Header */}
        <header style={{
          width: '100%',
          background: 'var(--color-primary)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 700,
              fontSize: '1.25rem',
              color: '#fff',
              letterSpacing: '0.5px',
            }}>
              <ChainIcon size={22} color="var(--color-accent)" />
              CredChain
            </Link>

            <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <Link href="/issue" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: 'rgba(255,255,255,0.75)',
                fontWeight: 500,
                fontSize: '0.9rem',
                transition: 'color 0.2s',
              }}>
                <FileTextIcon size={16} />
                Issue
              </Link>
              <Link href="/verify" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: 'rgba(255,255,255,0.75)',
                fontWeight: 500,
                fontSize: '0.9rem',
                transition: 'color 0.2s',
              }}>
                <ShieldCheckIcon size={16} />
                Verify
              </Link>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {address ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 12px',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.85)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    <WalletIcon size={14} color="var(--color-accent)" />
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <span style={{
                    background: network === 'Sepolia' ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)',
                    borderRadius: 20,
                    padding: '3px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: network === 'Sepolia' ? '#4ade80' : '#fca5a5',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {network}
                  </span>
                  {isWhitelisted !== null && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      background: isWhitelisted ? 'rgba(22,163,74,0.15)' : 'rgba(217,119,6,0.15)',
                      borderRadius: 20,
                      padding: '3px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: isWhitelisted ? '#4ade80' : '#fbbf24',
                    }}>
                      {isWhitelisted ? <><CheckCircleIcon size={12} /> Issuer</> : <><AlertTriangleIcon size={12} /> Not Issuer</>}
                    </span>
                  )}
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={connecting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'var(--color-accent)',
                    color: '#fff',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: connecting ? 'default' : 'pointer',
                    opacity: connecting ? 0.7 : 1,
                    transition: 'background 0.2s',
                  }}
                >
                  <WalletIcon size={16} />
                  {connecting ? 'Connecting…' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <Component {...pageProps} />
        </main>

        {/* Footer */}
        <footer style={{
          width: '100%',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
        }}>
          <div style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '20px 24px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '0.82rem',
            fontWeight: 500,
          }}>
            © {new Date().getFullYear()} CredChain · Decentralized Credential Verification
          </div>
        </footer>
      </div>
    </WalletContext.Provider>
  );
}

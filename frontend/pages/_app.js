import '../styles/globals.css';
import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';

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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(120deg, #e0f7fa 0%, #f8fafc 100%)' }}>
        {/* Shared Header */}
        <header style={{
          width: '100%',
          background: 'linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)',
          color: '#fff',
          padding: '14px 0',
          boxShadow: '0 2px 12px #e0e7ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          paddingLeft: 32,
          paddingRight: 32,
        }}>
          <Link href="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '1px', color: '#fff', textDecoration: 'none' }}>
            🔗 CredChain
          </Link>
          <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/issue" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'none', fontSize: '1rem' }}>
              📝 Issue
            </Link>
            <Link href="/verify" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'none', fontSize: '1rem' }}>
              ✅ Verify
            </Link>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {address ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                }}>
                  🦊 {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <span style={{
                  background: network === 'Sepolia' ? '#43e97b' : '#ff512f',
                  borderRadius: 12,
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                  {network}
                </span>
                {isWhitelisted !== null && (
                  <span style={{
                    background: isWhitelisted ? '#43e97b' : '#ff9800',
                    borderRadius: 12,
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}>
                    {isWhitelisted ? '✓ Issuer' : '⚠ Not Issuer'}
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  padding: '8px 20px',
                  borderRadius: 8,
                  border: '2px solid rgba(255,255,255,0.5)',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {connecting ? 'Connecting...' : '🦊 Connect Wallet'}
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1 }}>
          <Component {...pageProps} />
        </main>

        {/* Shared Footer */}
        <footer style={{
          width: '100%',
          background: 'linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)',
          color: '#fff',
          padding: '14px 0',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          boxShadow: '0 -2px 12px #e0e7ff',
        }}>
          © {new Date().getFullYear()} CredChain — Decentralized Credential Verification
        </footer>
      </div>
    </WalletContext.Provider>
  );
}

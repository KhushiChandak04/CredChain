import '../styles/globals.css';
import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { ChainIcon, FileTextIcon, ShieldCheckIcon, WalletIcon, CheckCircleIcon, AlertTriangleIcon, MenuIcon, CloseIcon, SmartphoneIcon } from '../components/Icons';

// Global wallet context so all pages share the same wallet state
export const WalletContext = createContext({
  address: '',
  network: '',
  isWhitelisted: null,
  connecting: false,
  hasProvider: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

export default function App({ Component, pageProps }) {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasProvider, setHasProvider] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted (client-side only) to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only detect provider, do NOT auto-connect
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setHasProvider(true);

      // Listen for account/chain changes only when already connected
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected from MetaMask side
          setAddress('');
          setNetwork('');
          setIsWhitelisted(null);
        } else {
          setAddress(accounts[0]);
          updateNetwork();
          checkWhitelist(accounts[0]);
        }
      };
      const handleChainChanged = () => {
        if (address) updateNetwork();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [address]);

  const updateNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setNetwork(chainId === '0xaa36a7' ? 'Sepolia' : 'Wrong Network');
    } catch {
      setNetwork('');
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
    if (typeof window === 'undefined') return;

    // Mobile: no provider — redirect to MetaMask deep link
    if (!window.ethereum) {
      const dappUrl = window.location.host + window.location.pathname;
      const metamaskDeepLink = `https://metamask.app.link/dapp/${dappUrl}`;
      window.open(metamaskDeepLink, '_blank');
      return;
    }

    setConnecting(true);
    try {
      // Force MetaMask to show the account selection popup every time
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setNetwork(chainId === '0xaa36a7' ? 'Sepolia' : 'Wrong Network');
        checkWhitelist(accounts[0]);
      }
    } catch (err) {
      // User rejected the request
      console.log('Connection rejected:', err.message);
      setAddress('');
      setNetwork('');
    }
    setConnecting(false);
    setMobileMenuOpen(false);
  };

  const disconnectWallet = async () => {
    // Revoke permissions so MetaMask forgets this site
    try {
      await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      });
    } catch (err) {
      // wallet_revokePermissions may not be supported in older MetaMask
      console.log('Revoke not supported, clearing state only');
    }
    setAddress('');
    setNetwork('');
    setIsWhitelisted(null);
    setMobileMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [Component]);

  return (
    <WalletContext.Provider value={{ address, network, isWhitelisted, connecting, hasProvider, connectWallet, disconnectWallet }}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
        {/* Header */}
        <header style={{
          width: '100%',
          background: 'var(--color-primary)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          zIndex: 100,
        }}>
          <div className="header-inner">
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

            {/* Desktop Nav */}
            <nav className="desktop-nav">
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

            {/* Desktop Wallet Area */}
            <div className="desktop-wallet">
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
                  <button
                    onClick={disconnectWallet}
                    title="Disconnect wallet"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'rgba(220,38,38,0.15)',
                      color: '#fca5a5',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(220,38,38,0.25)',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.3)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.15)'; }}
                  >
                    <CloseIcon size={12} />
                    Disconnect
                  </button>
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

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-sm)',
                padding: 8,
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              {mobileMenuOpen ? <CloseIcon size={20} color="#fff" /> : <MenuIcon size={20} color="#fff" />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu">
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Link href="/issue" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                  <FileTextIcon size={18} />
                  Issue Credential
                </Link>
                <Link href="/verify" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                  <ShieldCheckIcon size={18} />
                  Verify Credential
                </Link>
              </nav>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '8px 0', padding: '8px 0 0' }}>
                {address ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 12px',
                        fontSize: '0.85rem',
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
                        padding: '4px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: network === 'Sepolia' ? '#4ade80' : '#fca5a5',
                        textTransform: 'uppercase',
                      }}>
                        {network}
                      </span>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        background: 'rgba(220,38,38,0.2)',
                        color: '#fca5a5',
                        padding: '10px 16px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(220,38,38,0.3)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                    >
                      <CloseIcon size={14} />
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      onClick={connectWallet}
                      disabled={connecting}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        background: 'var(--color-accent)',
                        color: '#fff',
                        padding: '12px 18px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: connecting ? 'default' : 'pointer',
                        opacity: connecting ? 0.7 : 1,
                        width: '100%',
                      }}
                    >
                      <WalletIcon size={16} />
                      {connecting ? 'Connecting…' : hasProvider ? 'Connect Wallet' : 'Open in MetaMask'}
                    </button>
                    {!hasProvider && (
                      <p style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.78rem',
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: 1.4,
                      }}>
                        <SmartphoneIcon size={13} /> No wallet detected. Tap above to open in the MetaMask app, or{' '}
                        <a
                          href="https://metamask.io/download/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
                        >
                          install MetaMask
                        </a>.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Mobile: no wallet provider banner */}
        {mounted && !hasProvider && !address && (
          <div className="mobile-wallet-banner">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'var(--color-warning-bg)',
              padding: '10px 16px',
              fontSize: '0.85rem',
              color: 'var(--color-warning)',
              fontWeight: 600,
              textAlign: 'center',
              flexWrap: 'wrap',
            }}>
              <SmartphoneIcon size={16} />
              No wallet detected.
              <button
                onClick={connectWallet}
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Open in MetaMask
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="main-content">
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

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </WalletContext.Provider>
  );
}

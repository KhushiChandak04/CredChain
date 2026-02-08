import React, { useState, useEffect } from 'react';

export default function WalletConnect() {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [hasProvider, setHasProvider] = useState(false);

  // Only check for provider, do NOT auto-connect
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setHasProvider(true);

      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setAddress('');
          setNetwork('');
        } else {
          setAddress(accounts[0]);
          updateNetwork();
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
      setNetwork(chainId === '0xaa36a7' ? 'Sepolia' : 'Unknown');
    } catch {
      setNetwork('');
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    if (typeof window !== 'undefined' && !window.ethereum) {
      const dappUrl = window.location.host + window.location.pathname;
      window.open(`https://metamask.app.link/dapp/${dappUrl}`, '_blank');
      setConnecting(false);
      return;
    }
    if (window.ethereum) {
      try {
        // Force MetaMask popup every time
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          await updateNetwork();
        }
      } catch (err) {
        setAddress('');
        setNetwork('');
      }
    }
    setConnecting(false);
  };

  const handleDisconnect = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      });
    } catch (err) {
      console.log('Revoke not supported, clearing state only');
    }
    setAddress('');
    setNetwork('');
  };

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap: 8}}>
      {!address ? (
        <button
          onClick={handleConnect}
          disabled={connecting}
          style={{
            background: 'linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 2px 8px #eee',
            cursor: connecting ? 'default' : 'pointer',
            opacity: connecting ? 0.7 : 1,
            transition: 'background 0.3s, transform 0.2s',
          }}
        >
          {connecting ? 'Connecting...' : hasProvider ? 'Connect Wallet' : 'Open in MetaMask'}
        </button>
      ) : (
        <>
          <div style={{
            color:'#0070f3',
            fontWeight:'bold',
            fontSize:'1rem',
            background:'#e0f7fa',
            borderRadius:8,
            padding:'6px 16px',
            boxShadow:'0 1px 4px #e0e7ff',
          }}>
            Connected: {address.slice(0,6)}...{address.slice(-4)}
          </div>
          {network && (
            <div style={{
              color: network === 'Sepolia' ? '#009688' : '#ff9800',
              fontWeight:'bold',
              fontSize:'1rem',
              background:'#f8fafc',
              borderRadius:8,
              padding:'4px 14px',
              boxShadow:'0 1px 4px #e0e7ff',
            }}>
              Network: {network}
            </div>
          )}
          <button
            onClick={handleDisconnect}
            style={{
              background: 'transparent',
              color: '#dc2626',
              padding: '8px 20px',
              borderRadius: '8px',
              border: '1px solid #dc2626',
              fontWeight: 'bold',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Disconnect Wallet
          </button>
        </>
      )}
    </div>
  );
}

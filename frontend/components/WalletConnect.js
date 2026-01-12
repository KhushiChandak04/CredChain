import { useState } from 'react';


export default function WalletConnect() {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId === '0xaa36a7') {
          setNetwork('Sepolia');
        } else {
          setNetwork('Unknown');
        }
      } catch (err) {
        setAddress('');
        setNetwork('');
      }
    }
    setConnecting(false);
  };

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <button
        onClick={handleConnect}
        disabled={!!address || connecting}
        style={{
          background: address ? 'linear-gradient(90deg, #00c6ff 0%, #0070f3 100%)' : 'linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)',
          color: '#fff',
          padding: '12px 28px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 'bold',
          fontSize: '1rem',
          boxShadow: '0 2px 8px #eee',
          cursor: address ? 'default' : 'pointer',
          opacity: connecting ? 0.7 : 1,
          transition: 'background 0.3s, transform 0.2s',
          marginBottom: '0.5rem',
        }}
        onMouseOver={e => !address && (e.currentTarget.style.background = 'linear-gradient(90deg, #00c6ff 0%, #0070f3 100%)')}
        onMouseOut={e => !address && (e.currentTarget.style.background = 'linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)')}
        onMouseDown={e => !address && (e.currentTarget.style.transform = 'scale(0.97)')}
        onMouseUp={e => !address && (e.currentTarget.style.transform = 'scale(1)')}
      >
        {address ? '🦊 Wallet Connected' : connecting ? 'Connecting...' : '🦊 Connect Wallet'}
      </button>
      {address && (
        <div style={{
          color:'#0070f3',
          fontWeight:'bold',
          fontSize:'1rem',
          background:'#e0f7fa',
          borderRadius:8,
          padding:'6px 16px',
          boxShadow:'0 1px 4px #e0e7ff',
          marginBottom:'0.3rem',
        }}>
          Connected: {address.slice(0,6)}...{address.slice(-4)}
        </div>
      )}
      {network && address && (
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
    </div>
  );
}

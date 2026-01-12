import { useState } from 'react';

export default function WalletConnect() {
  const [address, setAddress] = useState('');
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
      } catch (err) {
        setAddress('');
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
        }}>
          {address.slice(0,6)}...{address.slice(-4)}
        </div>
      )}
    </div>
  );
}

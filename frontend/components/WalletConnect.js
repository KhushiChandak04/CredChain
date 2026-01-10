import { useEffect } from 'react';

export default function WalletConnect({ onConnect }) {
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(onConnect);
    }
  }, [onConnect]);
  return <button onClick={onConnect}>Connect Wallet</button>;
}

import { useState } from 'react';
import { hashFile } from '../utils/hash';
import { ensureSepoliaNetwork } from '../utils/contract';
import { ethers } from 'ethers';

export default function VerifyCredentialForm() {
  const [file, setFile] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState('');
  const [badge, setBadge] = useState('');
  const [issuer, setIssuer] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [fileHash, setFileHash] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setBadge('');
    setResult('');
    setIssuer('');
    setTimestamp('');
    setFileHash('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setVerifying(true);
    setBadge('');
    setResult('');
    setIssuer('');
    setTimestamp('');

    try {
      await ensureSepoliaNetwork();
      const hash = await hashFile(file);
      setFileHash(hash);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ['function credentials(bytes32) view returns (address issuer, bytes32 hash, uint256 issuedAt)'],
        provider
      );
      const cred = await contract.credentials(hash);

      if (cred.issuedAt && cred.issuedAt.toString() !== '0') {
        setResult('Credential is valid and verified on-chain!');
        setBadge('valid');
        setIssuer(cred.issuer);
        setTimestamp(new Date(Number(cred.issuedAt) * 1000).toLocaleString());
      } else {
        setResult('Credential not found on-chain.');
        setBadge('invalid');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setResult('Verification failed. Please check your wallet connection and try again.');
      setBadge('error');
    }
    setVerifying(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      padding: 24,
      borderRadius: 16,
      background: 'linear-gradient(120deg, #f8fafc 0%, #e0f7fa 100%)',
      maxWidth: 440,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <label style={{ fontWeight: 'bold', marginBottom: 10, color: '#333' }}>Select credential file</label>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: 20, padding: '10px', borderRadius: 8, border: '1px solid #b2ebf2', width: '100%' }}
      />
      <button
        type="submit"
        disabled={!file || verifying}
        style={{
          background: 'linear-gradient(90deg, #00c6ff 0%, #0070f3 100%)',
          color: '#fff',
          padding: '14px 32px',
          borderRadius: '10px',
          border: 'none',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          boxShadow: '0 2px 8px #eee',
          cursor: (!file || verifying) ? 'default' : 'pointer',
          opacity: (!file || verifying) ? 0.7 : 1,
          transition: 'all 0.3s',
          marginBottom: '1.2rem',
        }}
      >
        {verifying ? '⏳ Verifying...' : '🔍 Verify Credential'}
      </button>

      {/* Status Badge */}
      {badge && (
        <div style={{
          marginBottom: 10,
          padding: '10px 24px',
          borderRadius: 16,
          fontWeight: 'bold',
          fontSize: '1.15rem',
          color: '#fff',
          background: badge === 'valid'
            ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
            : badge === 'invalid'
              ? 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)'
              : '#ff9800',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          {badge === 'valid' && '✅ VALID'}
          {badge === 'invalid' && '❌ NOT FOUND'}
          {badge === 'error' && '⚠️ ERROR'}
        </div>
      )}

      {result && (
        <div style={{
          color: badge === 'valid' ? '#2e7d32' : badge === 'invalid' ? '#c62828' : '#e65100',
          fontWeight: 'bold',
          fontSize: '0.95rem',
          marginBottom: 8,
        }}>
          {result}
        </div>
      )}

      {/* Credential Details */}
      {badge === 'valid' && (
        <div style={{
          background: '#e8f5e9',
          borderRadius: 12,
          padding: '16px 20px',
          width: '100%',
          marginTop: 4,
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2e7d32', marginBottom: 8 }}>
            📋 Credential Details
          </div>
          {issuer && (
            <div style={{ marginBottom: 6, fontSize: '0.9rem' }}>
              <b>🦊 Issuer:</b>{' '}
              <a
                href={`https://sepolia.etherscan.io/address/${issuer}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0070f3', textDecoration: 'underline', fontFamily: 'monospace', fontSize: '0.85rem' }}
              >
                {issuer.slice(0, 6)}...{issuer.slice(-4)}
              </a>
            </div>
          )}
          {timestamp && (
            <div style={{ marginBottom: 6, fontSize: '0.9rem' }}>
              <b>🕐 Issued At:</b>{' '}
              <span style={{ color: '#009688', fontWeight: 'bold' }}>{timestamp}</span>
            </div>
          )}
          {fileHash && (
            <div style={{ fontSize: '0.9rem' }}>
              <b>#️⃣ File Hash:</b>{' '}
              <span
                title={fileHash}
                style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#555', cursor: 'help' }}
              >
                {fileHash.slice(0, 10)}...{fileHash.slice(-8)}
              </span>
            </div>
          )}
        </div>
      )}
    </form>
  );
}

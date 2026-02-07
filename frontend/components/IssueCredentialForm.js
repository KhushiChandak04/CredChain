import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { uploadToIPFS } from '../utils/ipfs';
import { hashFile } from '../utils/hash';
import { issueCredential } from '../utils/contract';

export default function IssueCredentialForm() {
  const [file, setFile] = useState(null);
  const [step, setStep] = useState('idle'); // idle | uploading | hashing | issuing | done | error
  const [statusMsg, setStatusMsg] = useState('');
  const [ipfsCid, setIpfsCid] = useState('');
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStep('idle');
    setStatusMsg('');
    setIpfsCid('');
    setTxHash('');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setErrorMsg('');

    try {
      // Step 1: Upload to IPFS
      setStep('uploading');
      setStatusMsg('Uploading to IPFS via Pinata...');
      const cid = await uploadToIPFS(file);
      setIpfsCid(cid);

      // Step 2: Hash the file
      setStep('hashing');
      setStatusMsg('Hashing file (SHA-256)...');
      const fileHash = await hashFile(file);

      // Step 3: Issue on-chain
      setStep('issuing');
      setStatusMsg('Issuing credential on Sepolia... (confirm in MetaMask)');
      await issueCredential(fileHash);

      // Done
      setStep('done');
      setStatusMsg('Credential issued successfully! 🎉');
      setTimeout(() => router.push('/verify'), 2000);
    } catch (err) {
      setStep('error');
      console.error('Issue credential error:', err);
      // Show user-friendly messages, don't expose internals
      const msg = err.message || '';
      if (msg.includes('Not whitelisted')) {
        setErrorMsg('Your wallet is not whitelisted as an issuer.');
      } else if (msg.includes('user rejected') || msg.includes('denied')) {
        setErrorMsg('Transaction was rejected in MetaMask.');
      } else if (msg.includes('IPFS') || msg.includes('upload')) {
        setErrorMsg(msg);
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
      setStatusMsg('');
    }
  };

  const steps = [
    { key: 'uploading', label: '📤 Upload to IPFS' },
    { key: 'hashing', label: '#️⃣ Hash File' },
    { key: 'issuing', label: '⛓️ Issue On-Chain' },
    { key: 'done', label: '✅ Complete' },
  ];

  const stepOrder = ['uploading', 'hashing', 'issuing', 'done'];

  return (
    <form onSubmit={handleSubmit} style={{
      padding: 24,
      borderRadius: 16,
      background: 'linear-gradient(120deg, #f8fafc 0%, #e0f7fa 100%)',
      maxWidth: 420,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <label style={{ fontWeight: 'bold', marginBottom: 8, color: '#333' }}>Select credential file</label>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: 18, padding: '8px', borderRadius: 6, border: '1px solid #b2ebf2', width: '100%' }}
      />

      <button
        type="submit"
        disabled={!file || step === 'uploading' || step === 'hashing' || step === 'issuing' || step === 'done'}
        style={{
          background: step === 'done'
            ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
            : 'linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)',
          color: '#fff',
          padding: '12px 28px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 'bold',
          fontSize: '1rem',
          boxShadow: '0 2px 8px #eee',
          cursor: step !== 'idle' ? 'default' : 'pointer',
          opacity: (!file || step !== 'idle') ? 0.7 : 1,
          transition: 'all 0.3s',
          marginBottom: '1rem',
        }}
      >
        {step === 'done' ? '✅ Issued!' : step === 'idle' ? '📝 Issue Credential' : '⏳ Processing...'}
      </button>

      {/* Step Progress Badges */}
      {step !== 'idle' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {steps.map((s) => {
            const currentIdx = stepOrder.indexOf(step);
            const thisIdx = stepOrder.indexOf(s.key);
            let bg = '#e0e0e0';
            let color = '#888';
            if (step === 'error' && thisIdx <= stepOrder.indexOf('uploading')) {
              bg = '#fce4ec'; color = '#c62828';
            } else if (thisIdx < currentIdx) {
              bg = '#e8f5e9'; color = '#2e7d32';
            } else if (thisIdx === currentIdx) {
              bg = step === 'done' ? '#e8f5e9' : '#e3f2fd';
              color = step === 'done' ? '#2e7d32' : '#0070f3';
            }
            return (
              <span key={s.key} style={{
                background: bg,
                color,
                borderRadius: 12,
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 'bold',
              }}>
                {s.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Status message */}
      {statusMsg && (
        <div style={{ color: step === 'done' ? '#2e7d32' : '#0070f3', fontWeight: 'bold', fontSize: '1rem', marginBottom: 8 }}>
          {statusMsg}
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div style={{
          background: '#fce4ec',
          borderRadius: 10,
          padding: '10px 16px',
          color: '#c62828',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          marginBottom: 8,
          width: '100%',
          textAlign: 'center',
        }}>
          ❌ {errorMsg}
        </div>
      )}

      {/* IPFS CID */}
      {ipfsCid && (
        <div style={{
          background: '#e8f5e9',
          borderRadius: 10,
          padding: '10px 16px',
          marginBottom: 8,
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: 4 }}>📌 IPFS CID</div>
          <div style={{ fontSize: '0.8rem', color: '#333', wordBreak: 'break-all', fontFamily: 'monospace' }}>{ipfsCid}</div>
          <a
            href={`https://gateway.pinata.cloud/ipfs/${ipfsCid}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#009688', fontWeight: 'bold', fontSize: '0.85rem', textDecoration: 'underline' }}
          >
            View on IPFS ↗
          </a>
        </div>
      )}
    </form>
  );
}

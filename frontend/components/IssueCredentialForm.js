import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { uploadToIPFS } from '../utils/ipfs';
import { hashFile } from '../utils/hash';
import { issueCredential } from '../utils/contract';
import { UploadIcon, HashIcon, BoxIcon, CheckCircleIcon, XCircleIcon, LoaderIcon, FileTextIcon, ExternalLinkIcon, PinIcon } from './Icons';

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
      setStatusMsg('Uploading to IPFS via Pinata…');
      const cid = await uploadToIPFS(file);
      setIpfsCid(cid);

      // Step 2: Hash the file
      setStep('hashing');
      setStatusMsg('Hashing file (SHA-256)…');
      const fileHash = await hashFile(file);

      // Step 3: Issue on-chain
      setStep('issuing');
      setStatusMsg('Issuing credential on Sepolia… (confirm in MetaMask)');
      await issueCredential(fileHash);

      // Done
      setStep('done');
      setStatusMsg('Credential issued successfully!');
      setTimeout(() => router.push('/verify'), 2000);
    } catch (err) {
      setStep('error');
      console.error('Issue credential error:', err);
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
    { key: 'uploading', label: 'Upload', icon: <UploadIcon size={13} /> },
    { key: 'hashing', label: 'Hash', icon: <HashIcon size={13} /> },
    { key: 'issuing', label: 'On-Chain', icon: <BoxIcon size={13} /> },
    { key: 'done', label: 'Complete', icon: <CheckCircleIcon size={13} /> },
  ];

  const stepOrder = ['uploading', 'hashing', 'issuing', 'done'];

  return (
    <form onSubmit={handleSubmit} style={{
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      {/* File Input */}
      <div>
        <label style={{
          display: 'block',
          fontWeight: 600,
          fontSize: '0.85rem',
          color: 'var(--color-text)',
          marginBottom: 6,
        }}>
          Select credential file
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg)',
            fontSize: '0.88rem',
            color: 'var(--color-text)',
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!file || step === 'uploading' || step === 'hashing' || step === 'issuing' || step === 'done'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: step === 'done' ? 'var(--color-success)' : 'var(--color-accent)',
          color: '#fff',
          padding: '11px 24px',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: step !== 'idle' ? 'default' : 'pointer',
          opacity: (!file || step !== 'idle') ? 0.6 : 1,
          transition: 'all 0.2s',
          width: '100%',
        }}
      >
        {step === 'done'
          ? <><CheckCircleIcon size={16} /> Issued</>
          : step === 'idle'
            ? <><FileTextIcon size={16} /> Issue Credential</>
            : <><LoaderIcon size={16} /> Processing…</>
        }
      </button>

      {/* Step Progress */}
      {step !== 'idle' && (
        <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {steps.map((s) => {
            const currentIdx = stepOrder.indexOf(step);
            const thisIdx = stepOrder.indexOf(s.key);
            let bg, color;
            if (step === 'error' && thisIdx <= 0) {
              bg = 'var(--color-error-bg)';
              color = 'var(--color-error)';
            } else if (thisIdx < currentIdx) {
              bg = 'var(--color-success-bg)';
              color = 'var(--color-success)';
            } else if (thisIdx === currentIdx) {
              bg = step === 'done' ? 'var(--color-success-bg)' : 'var(--color-accent-light)';
              color = step === 'done' ? 'var(--color-success)' : 'var(--color-accent)';
            } else {
              bg = 'var(--color-bg)';
              color = 'var(--color-text-muted)';
            }
            return (
              <span key={s.key} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: bg,
                color,
                borderRadius: 20,
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                {s.icon} {s.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Status message */}
      {statusMsg && (
        <div className={step !== 'done' ? 'pulse' : ''} style={{
          color: step === 'done' ? 'var(--color-success)' : 'var(--color-accent)',
          fontWeight: 600,
          fontSize: '0.88rem',
          textAlign: 'center',
        }}>
          {statusMsg}
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--color-error-bg)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          color: 'var(--color-error)',
          fontWeight: 500,
          fontSize: '0.85rem',
        }}>
          <XCircleIcon size={16} />
          {errorMsg}
        </div>
      )}

      {/* IPFS CID */}
      {ipfsCid && (
        <div style={{
          background: 'var(--color-success-bg)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            marginBottom: 6,
          }}>
            <PinIcon size={13} /> IPFS CID
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--color-text)',
            wordBreak: 'break-all',
            fontFamily: 'var(--font-mono)',
            marginBottom: 6,
          }}>
            {ipfsCid}
          </div>
          <a
            href={`https://gateway.pinata.cloud/ipfs/${ipfsCid}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: 'var(--color-accent)',
              fontWeight: 600,
              fontSize: '0.82rem',
            }}
          >
            View on IPFS <ExternalLinkIcon size={13} />
          </a>
        </div>
      )}
    </form>
  );
}

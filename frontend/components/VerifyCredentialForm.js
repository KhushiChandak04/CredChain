import { useState } from 'react';
import { hashFile } from '../utils/hash';
import { ensureSepoliaNetwork } from '../utils/contract';
import { ethers } from 'ethers';
import { SearchIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, LoaderIcon, ClipboardIcon, UserCheckIcon, ClockIcon, HashIcon, ExternalLinkIcon } from './Icons';

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
        setResult('Credential is valid and verified on-chain.');
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
        disabled={!file || verifying}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: 'var(--color-accent)',
          color: '#fff',
          padding: '11px 24px',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: (!file || verifying) ? 'default' : 'pointer',
          opacity: (!file || verifying) ? 0.6 : 1,
          transition: 'all 0.2s',
          width: '100%',
        }}
      >
        {verifying
          ? <><LoaderIcon size={16} /> Verifying…</>
          : <><SearchIcon size={16} /> Verify Credential</>
        }
      </button>

      {/* Status Badge */}
      {badge && (
        <div className="fade-in" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '10px 20px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          fontSize: '0.9rem',
          color: '#fff',
          background: badge === 'valid' ? 'var(--color-success)'
            : badge === 'invalid' ? 'var(--color-error)'
            : 'var(--color-warning)',
        }}>
          {badge === 'valid' && <><CheckCircleIcon size={18} /> VALID</>}
          {badge === 'invalid' && <><XCircleIcon size={18} /> NOT FOUND</>}
          {badge === 'error' && <><AlertTriangleIcon size={18} /> ERROR</>}
        </div>
      )}

      {/* Result Text */}
      {result && (
        <div style={{
          color: badge === 'valid' ? 'var(--color-success)'
            : badge === 'invalid' ? 'var(--color-error)'
            : 'var(--color-warning)',
          fontWeight: 500,
          fontSize: '0.88rem',
          textAlign: 'center',
        }}>
          {result}
        </div>
      )}

      {/* Credential Details */}
      {badge === 'valid' && (
        <div className="fade-in" style={{
          background: 'var(--color-success-bg)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            marginBottom: 12,
          }}>
            <ClipboardIcon size={14} /> Credential Details
          </div>

          {issuer && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
              fontSize: '0.88rem',
            }}>
              <UserCheckIcon size={15} color="var(--color-success)" />
              <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Issuer</span>
              <a
                href={`https://sepolia.etherscan.io/address/${issuer}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'var(--color-accent)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                }}
              >
                {issuer.slice(0, 6)}...{issuer.slice(-4)}
                <ExternalLinkIcon size={12} />
              </a>
            </div>
          )}
          {timestamp && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
              fontSize: '0.88rem',
            }}>
              <ClockIcon size={15} color="var(--color-success)" />
              <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Issued</span>
              <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{timestamp}</span>
            </div>
          )}
          {fileHash && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.88rem',
            }}>
              <HashIcon size={15} color="var(--color-success)" />
              <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Hash</span>
              <span
                title={fileHash}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--color-text-muted)',
                  cursor: 'help',
                }}
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

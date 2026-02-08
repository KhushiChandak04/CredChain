import IssueCredentialForm from '../components/IssueCredentialForm';
import { useWallet } from './_app';
import { WalletIcon, CheckCircleIcon, AlertTriangleIcon, LoaderIcon } from '../components/Icons';

export default function Issue() {
  const { address, isWhitelisted, connectWallet, hasProvider } = useWallet();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '32px 0',
    }}>
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
        padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)',
        maxWidth: 500,
        width: '100%',
      }}>
        <h2 style={{
          color: 'var(--color-text)',
          fontWeight: 700,
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
          marginBottom: 6,
          letterSpacing: '-0.3px',
        }}>
          Issuer Dashboard
        </h2>
        <p style={{
          color: 'var(--color-text-secondary)',
          marginBottom: 20,
          fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
          lineHeight: 1.6,
        }}>
          Upload and issue new credentials. Only cryptographic hashes are stored on-chain for privacy.
        </p>

        {/* Wallet & Whitelist Status */}
        {address ? (
          <div style={{ marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--color-accent-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--color-accent-dark)',
              fontFamily: 'var(--font-mono)',
              wordBreak: 'break-all',
            }}>
              <WalletIcon size={14} />
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: isWhitelisted ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: isWhitelisted ? 'var(--color-success)' : 'var(--color-warning)',
            }}>
              {isWhitelisted === null
                ? <><LoaderIcon size={14} /> Checking…</>
                : isWhitelisted
                  ? <><CheckCircleIcon size={14} /> Whitelisted Issuer</>
                  : <><AlertTriangleIcon size={14} /> Not Whitelisted</>
              }
            </span>
          </div>
        ) : (
          <div style={{
            background: 'var(--color-warning-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: 20,
            color: 'var(--color-warning)',
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            textAlign: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <WalletIcon size={16} />
              Please connect your wallet to issue credentials
            </div>
            <button
              onClick={connectWallet}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--color-accent)',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              <WalletIcon size={14} />
              {hasProvider ? 'Connect Wallet' : 'Open in MetaMask'}
            </button>
          </div>
        )}

        {isWhitelisted === false && address && (
          <div style={{
            background: 'var(--color-error-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: 16,
            color: 'var(--color-error)',
            fontSize: '0.85rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <AlertTriangleIcon size={16} />
            Your wallet is not whitelisted as an issuer. Contact the contract owner to get added.
          </div>
        )}

        <IssueCredentialForm />
      </div>
    </div>
  );
}

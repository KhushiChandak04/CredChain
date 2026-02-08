import VerifyCredentialForm from '../components/VerifyCredentialForm';
import { useWallet } from './_app';
import { WalletIcon } from '../components/Icons';

export default function Verify() {
  const { address, connectWallet, hasProvider } = useWallet();

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
          Verify Credential
        </h2>
        <p style={{
          color: 'var(--color-text-secondary)',
          marginBottom: 20,
          fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
          lineHeight: 1.6,
        }}>
          Upload a credential file to verify its authenticity against the blockchain record.
        </p>

        {!address && (
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
              Connect your wallet to verify credentials on Sepolia
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

        <VerifyCredentialForm />
      </div>
    </div>
  );
}

import VerifyCredentialForm from '../components/VerifyCredentialForm';
import { useWallet } from './_app';
import { WalletIcon } from '../components/Icons';

export default function Verify() {
  const { address } = useWallet();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '48px 0',
    }}>
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
        padding: '36px 32px',
        maxWidth: 500,
        width: '100%',
      }}>
        <h2 style={{
          color: 'var(--color-text)',
          fontWeight: 700,
          fontSize: '1.5rem',
          marginBottom: 6,
          letterSpacing: '-0.3px',
        }}>
          Verify Credential
        </h2>
        <p style={{
          color: 'var(--color-text-secondary)',
          marginBottom: 20,
          fontSize: '0.9rem',
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
            alignItems: 'center',
            gap: 8,
          }}>
            <WalletIcon size={16} />
            Connect your wallet to verify credentials on Sepolia
          </div>
        )}

        <VerifyCredentialForm />
      </div>
    </div>
  );
}

import IssueCredentialForm from '../components/IssueCredentialForm';
import { useWallet } from './_app';

export default function Issue() {
  const { address, isWhitelisted } = useWallet();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 6px 32px #e0e7ff',
        padding: '40px 32px',
        maxWidth: 520,
        width: '100%',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#0070f3', fontWeight: 'bold', fontSize: '2rem', marginBottom: 8 }}>
          📝 Issuer Dashboard
        </h2>
        <p style={{ color: '#333', marginBottom: 16, fontSize: '1.1rem' }}>
          Upload and issue new credentials. Only cryptographic hashes are stored on-chain for privacy.
        </p>

        {/* Wallet & Whitelist Status */}
        {address ? (
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{
              background: '#e0f7fa',
              borderRadius: 10,
              padding: '6px 14px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#0070f3',
            }}>
              🦊 {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <span style={{
              background: isWhitelisted ? '#e8f5e9' : '#fff3e0',
              borderRadius: 10,
              padding: '6px 14px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: isWhitelisted ? '#2e7d32' : '#e65100',
            }}>
              {isWhitelisted === null ? '⏳ Checking...' : isWhitelisted ? '✅ Whitelisted Issuer' : '⚠️ Not Whitelisted'}
            </span>
          </div>
        ) : (
          <div style={{
            background: '#fff3e0',
            borderRadius: 10,
            padding: '12px 20px',
            marginBottom: 20,
            color: '#e65100',
            fontWeight: 'bold',
          }}>
            🦊 Please connect your wallet to issue credentials
          </div>
        )}

        {isWhitelisted === false && address && (
          <div style={{
            background: '#fce4ec',
            borderRadius: 10,
            padding: '12px 20px',
            marginBottom: 16,
            color: '#c62828',
            fontSize: '0.9rem',
          }}>
            ⚠️ Your wallet is not whitelisted as an issuer. Contact the contract owner to get added.
          </div>
        )}

        <IssueCredentialForm />
      </div>
    </div>
  );
}

import VerifyCredentialForm from '../components/VerifyCredentialForm';
import { useWallet } from './_app';

export default function Verify() {
  const { address } = useWallet();

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
        <h2 style={{ color: '#00c6ff', fontWeight: 'bold', fontSize: '2rem', marginBottom: 8 }}>
          ✅ Verifier Interface
        </h2>
        <p style={{ color: '#333', marginBottom: 16, fontSize: '1.1rem' }}>
          Upload a credential file to verify its authenticity against the blockchain record.
        </p>

        {!address && (
          <div style={{
            background: '#fff3e0',
            borderRadius: 10,
            padding: '12px 20px',
            marginBottom: 20,
            color: '#e65100',
            fontWeight: 'bold',
          }}>
            🦊 Connect your wallet to verify credentials on Sepolia
          </div>
        )}

        <VerifyCredentialForm />
      </div>
    </div>
  );
}

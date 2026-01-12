import VerifyCredentialForm from '../components/VerifyCredentialForm';

export default function Verify() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e0f7fa 0%, #f8fafc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 6px 32px #e0e7ff',
        padding: '40px 32px',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
      }}>
        <h2 style={{color:'#00c6ff', fontWeight:'bold', fontSize:'2rem', marginBottom:12}}>Verifier Interface</h2>
        <p style={{color:'#333', marginBottom:24, fontSize:'1.1rem'}}>Upload a credential file to verify its authenticity against the blockchain record.</p>
        <VerifyCredentialForm />
      </div>
    </div>
  );
}

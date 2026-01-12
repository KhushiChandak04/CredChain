import IssueCredentialForm from '../components/IssueCredentialForm';

export default function Issue() {
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
        <h2 style={{color:'#0070f3', fontWeight:'bold', fontSize:'2rem', marginBottom:12}}>Issuer Dashboard</h2>
        <p style={{color:'#333', marginBottom:24, fontSize:'1.1rem'}}>Upload and issue new credentials. Only cryptographic hashes are stored on-chain for privacy.</p>
        <IssueCredentialForm />
      </div>
    </div>
  );
}

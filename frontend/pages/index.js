import Head from 'next/head';
import WalletConnect from '../components/WalletConnect';
import HashTest from '../components/HashTest';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e0f7fa 0%, #f8fafc 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Head>
        <title>CredChain - Decentralized Credential Verification</title>
      </Head>
      <header style={{
        width: '100%',
        background: 'linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)',
        color: '#fff',
        padding: '18px 0',
        boxShadow: '0 2px 12px #e0e7ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{fontWeight:'bold', fontSize:'1.5rem', letterSpacing:'1px', marginRight:32}}>CredChain</div>
        <nav style={{display:'flex', gap:'24px'}}>
          <a href="/issue" style={{color:'#fff', fontWeight:'bold', textDecoration:'none', fontSize:'1.1rem'}}>Issuer Dashboard</a>
          <a href="/verify" style={{color:'#fff', fontWeight:'bold', textDecoration:'none', fontSize:'1.1rem'}}>Verifier</a>
        </nav>
      </header>
      <main style={{flex:1}}>
        <section style={{
          padding: '64px 0 32px 0',
          textAlign: 'center',
        }}>
          <div style={{marginBottom: '1.5rem'}}>
            <WalletConnect />
          </div>
          <h1 style={{color:'#0070f3', fontWeight:'bold', fontSize:'2.5rem', marginBottom:12}}>Decentralized Credential Verification</h1>
          <p style={{color:'#333', fontSize:'1.2rem', marginBottom:24}}>
            Issue, store, and verify tamper-proof credentials on Ethereum.<br />
            Privacy-first. No central authority. Powered by blockchain and IPFS.
          </p>
          <div style={{display:'flex', justifyContent:'center', gap:'24px', marginBottom:'2rem'}}>
            <a href="/issue" style={{
              background: 'linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textDecoration: 'none',
              boxShadow: '0 2px 8px #eee',
              transition: 'background 0.3s, transform 0.2s',
            }}>Issue Credential</a>
            <a href="/verify" style={{
              background: 'linear-gradient(90deg, #00c6ff 0%, #0070f3 100%)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textDecoration: 'none',
              boxShadow: '0 2px 8px #eee',
              transition: 'background 0.3s, transform 0.2s',
            }}>Verify Credential</a>
          </div>
        </section>
        <section style={{display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'32px', padding:'0 0 48px 0'}}>
          <div style={{background:'#fff', borderRadius:16, boxShadow:'0 2px 12px #e0e7ff', padding:'24px', maxWidth:320, flex:'1 1 320px'}}>
            <h3 style={{color:'#0070f3', fontWeight:'bold', fontSize:'1.2rem'}}>For Issuers</h3>
            <p style={{color:'#333'}}>Upload and issue credentials securely. Only cryptographic hashes are stored on-chain.</p>
          </div>
          <div style={{background:'#fff', borderRadius:16, boxShadow:'0 2px 12px #e0e7ff', padding:'24px', maxWidth:320, flex:'1 1 320px'}}>
            <h3 style={{color:'#00c6ff', fontWeight:'bold', fontSize:'1.2rem'}}>For Verifiers</h3>
            <p style={{color:'#333'}}>Verify authenticity instantly by comparing hashes. No personal data exposure.</p>
          </div>
          <div style={{background:'#fff', borderRadius:16, boxShadow:'0 2px 12px #e0e7ff', padding:'24px', maxWidth:320, flex:'1 1 320px'}}>
            <h3 style={{color:'#009688', fontWeight:'bold', fontSize:'1.2rem'}}>For Users</h3>
            <p style={{color:'#333'}}>Own your credentials. Share them with confidence. Your privacy, your control.</p>
          </div>
        </section>
      </main>
      <footer style={{
        width: '100%',
        background: 'linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)',
        color: '#fff',
        padding: '18px 0',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1rem',
        boxShadow: '0 -2px 12px #e0e7ff',
      }}>
        <span>© {new Date().getFullYear()} CredChain. Built for real-world trust.</span>
      </footer>
    </div>
  );
}

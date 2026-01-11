import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>CredChain - Decentralized Credential Verification</title>
      </Head>
      <header className="header">
        <div className="logo">CredChain</div>
        <nav>
          <a href="/issue">Issuer Dashboard</a>
          <a href="/verify">Verifier</a>
        </nav>
      </header>
      <main className="main-landing">
        <section className="hero">
          <h1>Decentralized Credential Verification</h1>
          <p>
            Issue, store, and verify tamper-proof credentials on Ethereum.<br />
            Privacy-first. No central authority. Powered by blockchain and IPFS.
          </p>
          <div className="cta-buttons">
            <a href="/issue" className="cta">Issue Credential</a>
            <a href="/verify" className="cta secondary">Verify Credential</a>
          </div>
        </section>
        <section className="features">
          <div className="feature-card">
            <h3>For Issuers</h3>
            <p>Upload and issue credentials securely. Only cryptographic hashes are stored on-chain.</p>
          </div>
          <div className="feature-card">
            <h3>For Verifiers</h3>
            <p>Verify authenticity instantly by comparing hashes. No personal data exposure.</p>
          </div>
          <div className="feature-card">
            <h3>For Users</h3>
            <p>Own your credentials. Share them with confidence. Your privacy, your control.</p>
          </div>
        </section>
      </main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} CredChain. Built for real-world trust.</span>
      </footer>
    </>
  );
}

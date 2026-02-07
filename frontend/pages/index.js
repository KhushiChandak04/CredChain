import Head from 'next/head';
import Link from 'next/link';
import { useWallet } from './_app';

export default function Home() {
  const { address, network, isWhitelisted } = useWallet();

  return (
    <>
      <Head>
        <title>CredChain - Decentralized Credential Verification</title>
      </Head>

      {/* Hero */}
      <section style={{ padding: '64px 0 32px 0', textAlign: 'center' }}>
        <h1 style={{ color: '#0070f3', fontWeight: 'bold', fontSize: '2.5rem', marginBottom: 12 }}>
          Decentralized Credential Verification
        </h1>
        <p style={{ color: '#333', fontSize: '1.2rem', marginBottom: 24 }}>
          Issue, store, and verify tamper-proof credentials on Ethereum.<br />
          Privacy-first. No central authority. Powered by blockchain and IPFS.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <Link href="/issue" style={{
            background: 'linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)',
            color: '#fff',
            padding: '14px 32px',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textDecoration: 'none',
            boxShadow: '0 2px 8px #eee',
          }}>📝 Issue Credential</Link>
          <Link href="/verify" style={{
            background: 'linear-gradient(90deg, #00c6ff 0%, #0070f3 100%)',
            color: '#fff',
            padding: '14px 32px',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textDecoration: 'none',
            boxShadow: '0 2px 8px #eee',
          }}>✅ Verify Credential</Link>
        </div>
      </section>

      {/* Status Dashboard */}
      {address && (
        <section style={{
          maxWidth: 600,
          margin: '0 auto 32px auto',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 12px #e0e7ff',
          padding: '24px 32px',
        }}>
          <h3 style={{ color: '#0070f3', marginBottom: 12 }}>📊 Your Status</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <StatusBadge label="Wallet" value={`${address.slice(0, 6)}...${address.slice(-4)}`} color="#0070f3" />
            <StatusBadge label="Network" value={network} color={network === 'Sepolia' ? '#43e97b' : '#ff512f'} />
            <StatusBadge
              label="Issuer Role"
              value={isWhitelisted === null ? 'Unknown' : isWhitelisted ? 'Whitelisted ✓' : 'Not Whitelisted'}
              color={isWhitelisted ? '#43e97b' : '#ff9800'}
            />
          </div>
        </section>
      )}

      {/* Feature Cards */}
      <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', padding: '0 24px 48px 24px' }}>
        <FeatureCard
          title="For Issuers"
          color="#0070f3"
          icon="📝"
          description="Upload and issue credentials securely. Only cryptographic hashes are stored on-chain. Files are pinned to IPFS."
        />
        <FeatureCard
          title="For Verifiers"
          color="#00c6ff"
          icon="✅"
          description="Verify authenticity instantly by comparing hashes. See issuer address and timestamp on-chain."
        />
        <FeatureCard
          title="For Users"
          color="#009688"
          icon="🔐"
          description="Own your credentials. Share them with confidence. Your privacy, your control."
        />
      </section>
    </>
  );
}

function StatusBadge({ label, value, color }) {
  return (
    <div style={{
      background: '#f8fafc',
      borderRadius: 10,
      padding: '8px 16px',
      border: `2px solid ${color}`,
      textAlign: 'center',
      flex: '1 1 140px',
    }}>
      <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'bold' }}>{label}</div>
      <div style={{ fontSize: '1rem', color, fontWeight: 'bold' }}>{value}</div>
    </div>
  );
}

function FeatureCard({ title, color, icon, description }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 2px 12px #e0e7ff',
      padding: '24px',
      maxWidth: 320,
      flex: '1 1 280px',
    }}>
      <h3 style={{ color, fontWeight: 'bold', fontSize: '1.2rem' }}>{icon} {title}</h3>
      <p style={{ color: '#333' }}>{description}</p>
    </div>
  );
}

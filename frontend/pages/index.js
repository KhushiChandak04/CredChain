import Head from 'next/head';
import Link from 'next/link';
import { useWallet } from './_app';
import { FileTextIcon, ShieldCheckIcon, LockIcon, WalletIcon, CheckCircleIcon, AlertTriangleIcon } from '../components/Icons';

export default function Home() {
  const { address, network, isWhitelisted } = useWallet();

  return (
    <>
      <Head>
        <title>CredChain — Decentralized Credential Verification</title>
      </Head>

      {/* Hero */}
      <section style={{ padding: '72px 0 40px', textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
        <h1 style={{
          color: 'var(--color-text)',
          fontWeight: 700,
          fontSize: '2.6rem',
          lineHeight: 1.2,
          marginBottom: 16,
          letterSpacing: '-0.5px',
        }}>
          Decentralized Credential<br />Verification
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: '1.1rem',
          lineHeight: 1.7,
          marginBottom: 32,
          maxWidth: 520,
          margin: '0 auto 32px',
        }}>
          Issue, store, and verify tamper-proof credentials on Ethereum.
          Privacy-first. No central authority. Powered by blockchain and IPFS.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/issue" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--color-accent)',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'background 0.2s',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <FileTextIcon size={18} />
            Issue Credential
          </Link>
          <Link href="/verify" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            padding: '12px 28px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.95rem',
            border: '1px solid var(--color-border)',
            transition: 'border-color 0.2s',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <ShieldCheckIcon size={18} />
            Verify Credential
          </Link>
        </div>
      </section>

      {/* Status Dashboard */}
      {address && (
        <section className="fade-in" style={{
          maxWidth: 560,
          margin: '0 auto 40px',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '20px 24px',
        }}>
          <h3 style={{
            color: 'var(--color-text)',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Connection Status
          </h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <StatusBadge
              icon={<WalletIcon size={14} />}
              label="Wallet"
              value={`${address.slice(0, 6)}...${address.slice(-4)}`}
            />
            <StatusBadge
              icon={network === 'Sepolia' ? <CheckCircleIcon size={14} color="var(--color-success)" /> : <AlertTriangleIcon size={14} color="var(--color-error)" />}
              label="Network"
              value={network}
              valueColor={network === 'Sepolia' ? 'var(--color-success)' : 'var(--color-error)'}
            />
            <StatusBadge
              icon={isWhitelisted ? <CheckCircleIcon size={14} color="var(--color-success)" /> : <AlertTriangleIcon size={14} color="var(--color-warning)" />}
              label="Issuer Role"
              value={isWhitelisted === null ? 'Unknown' : isWhitelisted ? 'Whitelisted' : 'Not Whitelisted'}
              valueColor={isWhitelisted ? 'var(--color-success)' : 'var(--color-warning)'}
            />
          </div>
        </section>
      )}

      {/* Feature Cards */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
        padding: '0 0 64px',
        maxWidth: 860,
        margin: '0 auto',
      }}>
        <FeatureCard
          icon={<FileTextIcon size={24} color="var(--color-accent)" />}
          title="For Issuers"
          description="Upload and issue credentials securely. Only cryptographic hashes are stored on-chain. Files are pinned to IPFS."
        />
        <FeatureCard
          icon={<ShieldCheckIcon size={24} color="var(--color-accent)" />}
          title="For Verifiers"
          description="Verify authenticity instantly by comparing hashes. See issuer address and timestamp on-chain."
        />
        <FeatureCard
          icon={<LockIcon size={24} color="var(--color-accent)" />}
          title="For Users"
          description="Own your credentials. Share them with confidence. Your privacy, your control."
        />
      </section>
    </>
  );
}

function StatusBadge({ icon, label, value, valueColor }) {
  return (
    <div style={{
      background: 'var(--color-bg)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px',
      flex: '1 1 150px',
      minWidth: 0,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.72rem',
        color: 'var(--color-text-muted)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        marginBottom: 4,
      }}>
        {icon} {label}
      </div>
      <div style={{
        fontSize: '0.88rem',
        color: valueColor || 'var(--color-text)',
        fontWeight: 600,
        fontFamily: label === 'Wallet' ? 'var(--font-mono)' : 'inherit',
      }}>
        {value}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      padding: '28px 24px',
      transition: 'box-shadow 0.2s',
    }}>
      <div style={{ marginBottom: 14 }}>{icon}</div>
      <h3 style={{
        color: 'var(--color-text)',
        fontWeight: 600,
        fontSize: '1.05rem',
        marginBottom: 8,
      }}>
        {title}
      </h3>
      <p style={{
        color: 'var(--color-text-secondary)',
        fontSize: '0.9rem',
        lineHeight: 1.6,
      }}>
        {description}
      </p>
    </div>
  );
}

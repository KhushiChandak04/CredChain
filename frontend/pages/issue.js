import IssueCredentialForm from '../components/IssueCredentialForm';

export default function Issue() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Issuer Dashboard</h2>
        <p className="dashboard-desc">Upload and issue new credentials. Only cryptographic hashes are stored on-chain for privacy.</p>
        <IssueCredentialForm />
      </div>
    </div>
  );
}

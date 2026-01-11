import VerifyCredentialForm from '../components/VerifyCredentialForm';

export default function Verify() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Verifier Interface</h2>
        <p className="dashboard-desc">Upload a credential file to verify its authenticity against the blockchain record.</p>
        <VerifyCredentialForm />
      </div>
    </div>
  );
}

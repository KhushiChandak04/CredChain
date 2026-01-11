import { useState } from 'react';
import { hashFile } from '../utils/hash';
import { verifyCredential } from '../utils/contract';

export default function VerifyCredentialForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const fileHash = await hashFile(file);
    const isValid = await verifyCredential(fileHash);
    setResult(isValid ? 'Credential is valid!' : 'Credential not found.');
  };

  return (
    <form className="cred-form" onSubmit={handleSubmit}>
      <label className="cred-label">Select credential file</label>
      <input className="cred-input" type="file" onChange={handleFileChange} />
      <button className="cred-btn" type="submit">Verify Credential</button>
      <div className="cred-status">{result}</div>
    </form>
  );
}

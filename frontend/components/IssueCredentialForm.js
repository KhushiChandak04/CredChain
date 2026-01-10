import { useState } from 'react';
import { uploadToIPFS } from '../utils/ipfs';
import { hashFile } from '../utils/hash';
import { issueCredential } from '../utils/contract';

export default function IssueCredentialForm() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setStatus('Uploading to IPFS...');
    const ipfsHash = await uploadToIPFS(file);
    setStatus('Hashing file...');
    const fileHash = await hashFile(file);
    setStatus('Issuing credential...');
    await issueCredential(fileHash);
    setStatus('Credential issued! IPFS: ' + ipfsHash);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Issue Credential</button>
      <div>{status}</div>
    </form>
  );
}

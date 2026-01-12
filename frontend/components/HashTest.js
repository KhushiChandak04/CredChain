import React, { useState } from 'react';
import { hashFile } from '../utils/hash';

export default function HashTest() {
  const [hash, setHash] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  async function handleFileChange(e) {
    setError('');
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const hashValue = await hashFile(file);
      setHash(hashValue);
    } catch (err) {
      setError('Hashing failed: ' + err.message);
    }
  }

  return (
    <div style={{padding:20, border:'1px solid #ccc', borderRadius:8, maxWidth:400}}>
      <h3>File Hash Test</h3>
      <input type="file" onChange={handleFileChange} />
      {fileName && <div><b>File:</b> {fileName}</div>}
      {hash && <div><b>SHA-256 Hash:</b> <span style={{wordBreak:'break-all'}}>{hash}</span></div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  );
}

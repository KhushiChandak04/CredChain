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
      <h3>File Hash Test (Phase 2)</h3>
      <input type="file" onChange={handleFileChange} />
      {fileName && <div><b>File:</b> {fileName}</div>}
      {hash && <div><b>SHA-256 Hash:</b> <span style={{wordBreak:'break-all'}}>{hash}</span></div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      <ul style={{marginTop:10}}>
        <li>Upload original file → hash A</li>
        <li>Upload same file again → hash A (same)</li>
        <li>Edit file slightly → hash B (different)</li>
      </ul>
      <div style={{marginTop:10, fontSize:12, color:'#555'}}>
        <b>Requirement:</b> Same file always gives same hash. Any change gives a different hash. <br/>
        <b>Phase 2 is complete when:</b> You see this behavior for any file.
      </div>
    </div>
  );
}

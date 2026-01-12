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
    <form className="cred-form" onSubmit={handleSubmit} style={{
      padding: 32,
      borderRadius: 16,
      boxShadow: '0 4px 24px #e0e7ff',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e0f7fa 100%)',
      maxWidth: 420,
      margin: '32px auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h3 style={{marginBottom:16, color:'#0070f3', fontWeight:'bold', fontSize:'1.3rem'}}>Issue New Credential</h3>
      <label className="cred-label" style={{fontWeight:'bold', marginBottom:8}}>Select credential file</label>
      <input className="cred-input" type="file" onChange={handleFileChange} style={{marginBottom:18, padding:'8px', borderRadius:6, border:'1px solid #b2ebf2', width:'100%'}} />
      <button className="cred-btn" type="submit" style={{
        background: 'linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)',
        color: '#fff',
        padding: '12px 28px',
        borderRadius: '8px',
        border: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
        boxShadow: '0 2px 8px #eee',
        cursor: 'pointer',
        transition: 'background 0.3s, transform 0.2s',
        marginBottom: '1rem',
      }}
        onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #00c6ff 0%, #0070f3 100%)'}
        onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #0070f3 0%, #00c6ff 100%)'}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Issue Credential
      </button>
      <div className="cred-status" style={{marginTop:12, color:'#0070f3', fontWeight:'bold', fontSize:'1.1rem'}}>{status}</div>
    </form>
  );
}

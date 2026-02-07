export async function uploadToIPFS(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    // Only show safe, user-friendly error messages
    const safeErrors = [
      'No file uploaded',
      'File too large. Maximum size is 10MB.',
      'File type not allowed. Accepted: PDF, PNG, JPEG, JSON, TXT.',
    ];
    const msg = safeErrors.includes(errData.error) ? errData.error : 'IPFS upload failed. Please try again.';
    throw new Error(msg);
  }

  const data = await res.json();
  return data.cid;
}

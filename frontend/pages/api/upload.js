import formidable from 'formidable';
import fs from 'fs';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/png', 'image/jpeg', 'image/jpg',
  'application/json',
  'text/plain',
];

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
    });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

function cleanupTempFile(filepath) {
  try {
    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch { /* ignore cleanup errors */ }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let tempFilePath = null;

  try {
    const { files } = await parseForm(req);

    // formidable v3+ returns arrays
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    tempFilePath = file.filepath;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      cleanupTempFile(tempFilePath);
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }

    // Validate file type
    if (file.mimetype && !ALLOWED_TYPES.includes(file.mimetype)) {
      cleanupTempFile(tempFilePath);
      return res.status(400).json({ error: 'File type not allowed. Accepted: PDF, PNG, JPEG, JSON, TXT.' });
    }

    const fileBuffer = fs.readFileSync(file.filepath);
    const blob = new Blob([fileBuffer]);

    // Sanitize filename — strip path separators and limit length
    const safeName = (file.originalFilename || 'upload')
      .replace(/[\\/]/g, '_')
      .slice(0, 100);

    const formData = new FormData();
    formData.append('file', blob, safeName);

    const pinataJwt = process.env.PINATA_JWT;
    if (!pinataJwt) {
      cleanupTempFile(tempFilePath);
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const pinataRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pinataJwt}`,
      },
      body: formData,
    });

    // Always clean up temp file after Pinata call
    cleanupTempFile(tempFilePath);

    if (!pinataRes.ok) {
      return res.status(502).json({ error: 'Failed to pin file to IPFS. Please try again.' });
    }

    const data = await pinataRes.json();
    return res.status(200).json({ cid: data.IpfsHash });
  } catch (e) {
    cleanupTempFile(tempFilePath);
    console.error('Upload error:', e);
    // Never expose internal error details to the client
    return res.status(500).json({ error: 'Upload failed. Please try again.' });
  }
}

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { files } = await parseForm(req);

    // formidable v3+ returns arrays
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileStream = fs.readFileSync(file.filepath);
    const blob = new Blob([fileStream]);

    const formData = new FormData();
    formData.append('file', blob, file.originalFilename || 'upload');

    const pinataJwt = process.env.PINATA_JWT;
    if (!pinataJwt) {
      return res.status(500).json({ error: 'PINATA_JWT not configured in .env.local' });
    }

    const pinataRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pinataJwt}`,
      },
      body: formData,
    });

    if (!pinataRes.ok) {
      const errText = await pinataRes.text();
      return res.status(500).json({ error: `Pinata error: ${errText}` });
    }

    const data = await pinataRes.json();
    return res.status(200).json({ cid: data.IpfsHash });
  } catch (e) {
    console.error('Upload error:', e);
    return res.status(500).json({ error: e.message });
  }
}

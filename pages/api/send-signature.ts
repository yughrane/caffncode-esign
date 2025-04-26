import type { NextApiRequest, NextApiResponse } from 'next';
import { formidable } from 'formidable'; // ✅ Correct way
import fs from 'fs';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = formidable({ keepExtensions: true }); // ✅ No 'new'

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.redirect('/error');
    }

    const signerEmail = fields.email as string;
    const pdfFile = Array.isArray(files.file) ? files.file[0].filepath : files.file?.filepath;

    if (!signerEmail || !pdfFile) {
      return res.redirect('/error');
    }

    try {
      // Your API logic continues here
      console.log('Form parsed successfully:', signerEmail, pdfFile);
      return res.redirect('/success');
    } catch (error: any) {
      console.error('Error sending signature request:', error.response?.data || error.message);
      return res.redirect('/error');
    }
  });
}
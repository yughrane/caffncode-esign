import type { NextApiRequest, NextApiResponse } from 'next';
import { formidable } from 'formidable'; // ✅ Correct way
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

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

  form.parse(req, async (err: any, fields: any, files: any) => {
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
        const formData = new FormData();
        const fileStream = fs.createReadStream(pdfFile);
      
        formData.append('file', fileStream);
      
        // Upload the file to Zoho Sign
        const fileUploadResponse = await axios.post(
          'https://sign.zoho.com/api/v1/files',
          formData,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`,
              ...formData.getHeaders(),
            },
          }
        );
      
        const fileId = fileUploadResponse.data.files[0].file_id;
        console.log('File uploaded to Zoho Sign. File ID:', fileId);
      
        // Now create a signature request
        const createRequestResponse = await axios.post(
          'https://sign.zoho.com/api/v1/requests',
          {
            request_name: `Document Signature - ${new Date().toISOString()}`,
            action_type: 'Send for Signature',
            actions: [
              {
                recipient_email: signerEmail,
                recipient_name: signerEmail.split('@')[0],
                action_type: 'SIGN',
              },
            ],
            files: [fileId],
          },
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );
      
        console.log('Signature request created successfully:', createRequestResponse.data);
      
        return res.redirect('/success');
      } catch (error: any) {
        console.error('Error sending Zoho signature request:', error.response?.data || error.message);
        return res.redirect('/error');
      }
  });
}
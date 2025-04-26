import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>('');
  const [sending, setSending] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!pdfFile || !email) {
      alert('Please upload a file and enter an email.');
      return;
    }

    setSending(true);

    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('email', email);

    try {
      const response = await axios.post('/api/send-signature', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 307) {
        window.location.href = '/success';
      } else {
        alert('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      window.location.href = '/error';
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Head>
        <title>CaffnCode eSign Portal</title>
      </Head>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>CaffnCode eSign Portal</h1>
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
          <br /><br />
          <input
            type="email"
            placeholder="Signer Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br /><br />
          <button type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Send for Signature'}
          </button>
        </form>
      </div>
    </>
  );
}
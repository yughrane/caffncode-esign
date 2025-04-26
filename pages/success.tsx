import Head from 'next/head';

export default function SuccessPage() {
  return (
    <>
      <Head>
        <title>Success | CaffnCode eSign Portal</title>
      </Head>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🎉 Document Sent Successfully!</h1>
        <p>The signer has been notified via email. You will receive a signed copy once completed.</p>
        <br />
        <a href="/" style={{ textDecoration: 'underline' }}>Send Another Document</a>
      </div>
    </>
  );
}
import Head from 'next/head';

export default function ErrorPage() {
  return (
    <>
      <Head>
        <title>Error | CaffnCode eSign Portal</title>
      </Head>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>⚠️ Something Went Wrong</h1>
        <p>Unable to send the document for signing. Please try again later.</p>
        <br />
        <a href="/" style={{ textDecoration: 'underline' }}>Go Back Home</a>
      </div>
    </>
  );
}
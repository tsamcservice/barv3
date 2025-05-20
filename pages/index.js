import Image from 'next/image';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        color: '#A4924C'
      }}>
        呈璽理財藝術共享空間
      </h1>
      <img
        src="/uploads/vip/TS_D.jpg"
        alt="主圖"
        style={{
          width: '350px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}
      />
      <a
        href="/member-card-simple.html"
        style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          background: '#A4924C',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        進入會員卡
      </a>
    </div>
  );
} 
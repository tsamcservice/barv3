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
      <a
        href="/member-card-simtest.html"
        style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          background: '#06C755',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginTop: '1rem'
        }}
      >
        flex碼測試預覽頁
      </a>
      
      {/* 🔴 管理後台區塊 */}
      <div style={{
        background: '#dc3545',
        color: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        marginTop: '2rem',
        boxShadow: '0 4px 16px rgba(220,53,69,0.3)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h3 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.3rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          🔴 管理後台
        </h3>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <a
            href="/admin-points.html"
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            ⚙️ 點數設定管理
          </a>
          <a
            href="/points-history.html"
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            📊 交易記錄查詢
          </a>
          <a
            href="/member-card-simple.html"
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            🎨 會員卡編輯器
          </a>
        </div>
      </div>
    </div>
  );
} 
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
      {/* 🚀 v20250626-FINAL 版本導航區 */}
      <div style={{
        background: 'linear-gradient(135deg, #4caf50, #45a049)',
        color: 'white',
        padding: '2rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        boxShadow: '0 8px 24px rgba(76,175,80,0.3)',
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{
          margin: '0 0 1.5rem 0',
          fontSize: '1.8rem',
          fontWeight: 'bold'
        }}>
          🚀 會員卡系統 v20250626-FINAL
        </h2>
        <p style={{
          margin: '0 0 2rem 0',
          fontSize: '1rem',
          opacity: 0.9,
          lineHeight: 1.6
        }}>
          極速分享功能重大突破！分享至LINE從18秒優化到1-2秒 (90%性能提升)
        </p>
        
        {/* 主要版本按鈕群 */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          {/* 手機版 - 最大按鈕居中 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <a
              href="/member-card-mobile.html"
              style={{
                display: 'inline-block',
                padding: '1.5rem 3rem',
                background: 'linear-gradient(135deg, #00c300, #00a000)',
                color: '#fff',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 16px rgba(0,195,0,0.4)',
                transform: 'scale(1.1)',
                border: '3px solid rgba(255,255,255,0.3)'
              }}
            >
              📱 手機版 (正式)
            </a>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              LIFF: 2007327814-DGly5XNk<br/>
              極速分享 | 完整功能
            </div>
          </div>
          
          {/* 桌機版 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <a
              href="/member-card-desktop.html"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              💻 桌機版
            </a>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>
              傳統介面 | 大螢幕優化
            </div>
          </div>
          
          {/* 簡化版 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <a
              href="/member-card-simple.html"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              ⚡ 簡化版
            </a>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>
              基礎功能 | 快速載入
            </div>
          </div>
        </div>
        
        {/* A/B測試和開發版本 */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginTop: '1.5rem'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            🧪 開發測試版本
          </h3>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}>
              <a
                href="/mcard-mtest.html"
                style={{
                  background: 'rgba(255,193,7,0.9)',
                  color: '#000',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}
              >
                🧪 MTEST版
              </a>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>
                LIFF: OoJBbnwP<br/>A/B測試平台
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}>
              <a
                href="/member-card-simtest.html"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '13px'
                }}
              >
                📋 FLEX測試
              </a>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>
                JSON預覽工具
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}>
              <a
                href="/member-card-mobile-OLD.html"
                style={{
                  background: 'rgba(108,117,125,0.8)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '13px'
                }}
              >
                📦 備份版
              </a>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>
                緊急回復用
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
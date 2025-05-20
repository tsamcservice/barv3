   /** @type {import('next').NextConfig} */
   const nextConfig = {
    reactStrictMode: true,
    // 允許直接訪問 public 目錄下的 HTML 檔案
    async rewrites() {
      return [
        {
          source: '/member-card-simple.html',
          destination: '/member-card-simple.html',
        },
      ]
    }
  }
  
  module.exports = nextConfig
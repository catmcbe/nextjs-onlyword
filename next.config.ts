import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 配置允许的开发源，解决跨域警告
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.31.177:3000' // 根据实际网络配置调整
  ],
  // 其他配置选项
  experimental: {
    // 优化性能
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;

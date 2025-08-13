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
  },
  // 环境变量配置
  env: {
    NEXT_PUBLIC_ADMIN_USER: process.env.ADMIN_USER,
    NEXT_PUBLIC_ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    NEXT_PUBLIC_EXTRA_ADMIN_USER: process.env.EXTRA_ADMIN_USER,
    NEXT_PUBLIC_EXTRA_ADMIN_PASSWORD: process.env.EXTRA_ADMIN_PASSWORD,
  },
  // 增加API路由超时配置（解决504错误）
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

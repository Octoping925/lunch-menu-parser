import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 실제 이미지 호스트로 제한하는 것이 좋습니다
      },
    ],
  },
};

export default nextConfig;

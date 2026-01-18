/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/tarot-images-bis/:path*',
          destination: '/tarot images-bis/:path*',
        },
      ],
    }
  },
}

export default nextConfig

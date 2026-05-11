/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Fix: Move turbo from experimental to turbopack
  turbopack: {},  // Changed from experimental.turbo

  // Allow CORS and API requests to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : 'http://localhost:5000/api/:path*',
      },
    ]
  },

  // Use remotePatterns instead of deprecated `domains`
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: 'trellonode.onrender.com' },
    ],
  },
}

export default nextConfig
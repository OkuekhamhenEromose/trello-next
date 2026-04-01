/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow CORS and API requests to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : 'http://localhost:5000/api/:path*',
      },
    ];
  },
  // Images configuration if you have external images
  images: {
    domains: ['localhost', 'trellonode.onrender.com'],
  },
};

export default nextConfig;
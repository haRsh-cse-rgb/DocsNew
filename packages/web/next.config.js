/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.pexels.com',
      'technocorps.com',
      'logo.clearbit.com',
      'example.com',
      'cdn.pixabay.com'
    ],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5001/api/v1',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_BASE_URL || 'http://localhost:5001/api/v1'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
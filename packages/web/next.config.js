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
    NEXT_PUBLIC_API_URL: 'https://api.india-jobs.in',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.india-jobs.in/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
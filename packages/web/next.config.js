/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // <-- allows any domain over HTTPS
      },
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
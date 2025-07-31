/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['myportfolioimages1.s3.eu-west-2.amazonaws.com', 'pexels.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://daviduwtsdportfolio.netlify.app", // fallback, but...
          },
          {
            key: "Vary",
            value: "Origin", // necessary when Access-Control-Allow-Origin is dynamic
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization for production
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google user avatars
        pathname: '/**',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Redirects for better SEO and user experience
  async redirects() {
    return [
      // Redirect common auth error paths to home
      {
        source: '/api/auth/error',
        destination: '/',
        permanent: false,
      },
    ];
  },

  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,

  // Disable powered by header
  poweredByHeader: false,

  // Compression
  compress: true,

  // Performance monitoring (optional - requires setup)
  // experimental: {
  //   instrumentationHook: true,
  // },
};

export default nextConfig;


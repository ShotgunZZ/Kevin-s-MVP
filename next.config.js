/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify-specific optimizations
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Enable React strict mode for better debugging
  reactStrictMode: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
}

module.exports = nextConfig

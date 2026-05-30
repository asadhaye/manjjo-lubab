import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'work.fife.usercontent.google.com',
      },
      {
        protocol: 'https',
        hostname: 'gemini.google.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Change this version to force users to update their cached app
  version: '1.0.1',
})(nextConfig)

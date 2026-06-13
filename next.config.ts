import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow ngrok tunnels during local dev (replaces Vite's server.allowedHosts).
  allowedDevOrigins: ['*.ngrok-free.dev'],
}

export default nextConfig

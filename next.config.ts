import type { NextConfig } from 'next'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const projectRoot = dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow ngrok tunnels during local dev (replaces Vite's server.allowedHosts).
  allowedDevOrigins: ['*.ngrok-free.dev'],
  // Pin Turbopack workspace root to this project. A stray ~/package-lock.json
  // makes Next infer the home dir as root → scans entire home → dev compiles
  // hang for minutes. Pinning fixes slow/stuck route navigation in dev.
  turbopack: {
    root: projectRoot,
  },
}

export default nextConfig

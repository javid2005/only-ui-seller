import type { NextConfig } from 'next'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const projectRoot = dirname(fileURLToPath(import.meta.url))

// خروجی استاتیک برای «صفحهٔ نسخه‌ها» — با STATIC_EXPORT=1 فعال می‌شود و روی
// dev/build عادی هیچ اثری ندارد. خروجی در out/ ساخته و به‌صورت Artifact منتشر می‌شود.
const staticExport = process.env.STATIC_EXPORT === '1'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(staticExport
    ? {
        output: 'export' as const,
        trailingSlash: true,
        images: { unoptimized: true },
        // مسیرِ نسبی برای دارایی‌ها: صفحهٔ خروجی در ریشهٔ پوشهٔ Artifact می‌نشیند و
        // Artifact مسیرهای root-relative (/x) را سرو نمی‌کند. با assetPrefix خودِ
        // Next همه‌جا (از جمله runtime تURبوپک) نسبی می‌نویسد — دستکاری بعدیِ HTML
        // هیدریشن را می‌شکند، چون مسیرهای داخل payload با هم ناسازگار می‌شوند.
        assetPrefix: '.',
      }
    : {}),
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

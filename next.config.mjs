/** @type {import('next').NextConfig} */
const basePath = '/difr-demo'
const nextConfig = {
  output: 'export',
  basePath,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig

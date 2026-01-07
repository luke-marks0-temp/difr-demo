/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/difr-demo',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

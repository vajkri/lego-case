import type { NextConfig } from 'next'

const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // GitHub Pages serves from /repo-name/ subdirectory
  basePath: isGithubPages ? '/lego-case' : '',
  assetPrefix: isGithubPages ? '/lego-case/' : '',
}

export default nextConfig

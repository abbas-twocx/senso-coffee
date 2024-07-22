/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = require('./csp')
const redirects = require('./redirects')

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'scontent.cdninstagram.com', process.env.NEXT_PUBLIC_SERVER_URL]
      .filter(Boolean)
      .map(url => url.replace(/https?:\/\//, '')),
  },
  redirects,
  async headers() {
    const headers = []

    // Prevent search engines from indexing the site if it is not live
    // This is useful for staging environments before they are ready to go live
    // To allow robots to crawl the site, use the `NEXT_PUBLIC_IS_LIVE` env variable
    // You may want to also use this variable to conditionally render any tracking scripts
    if (!process.env.NEXT_PUBLIC_IS_LIVE) {
      headers.push({
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
        source: '/:path*',
      })
    }

    // Set the `Content-Security-Policy` header as a security measure to prevent XSS attacks
    // It works by explicitly whitelisting trusted sources of content for your website
    // This will block all inline scripts and styles except for those that are allowed
    // headers.push({
    //   source: '/(.*)',
    //   headers: [
    //     {
    //       key: 'Content-Security-Policy',
    //       value: "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' https://checkout.stripe.com https://api.stripe.com https://maps.googleapis.com https://graph.instagram.com; frame-src 'self';",
    //     },
    //   ],
    // })

    return headers
  },
}

module.exports = nextConfig

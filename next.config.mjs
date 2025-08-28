/** @type {import('next').NextConfig} */
const nextConfig = {
  // OPTIMIZED CONFIG FOR DEMO - Faster compilation
  
  // Disable telemetry for faster startup
  telemetry: false,
  
  // Simplified redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard/sites',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/dashboard/sites',
        permanent: false,
      }
    ]
  },
  
  // Simplified images config
  images: {
    unoptimized: true,
  },
  
  // Use SWC for faster builds
  swcMinify: true,
  
  // Disable source maps in dev for faster builds
  productionBrowserSourceMaps: false,
  
  // Optimize webpack for speed
  webpack: (config, { dev }) => {
    if (dev) {
      // Speed up dev builds
      config.optimization = {
        minimize: false,
        splitChunks: false,
        runtimeChunk: false,
      }
      
      // Ignore more files
      config.watchOptions = {
        ignored: [
          '**/node_modules',
          '**/.git',
          '**/*.test.*',
          '**/sentry*',
          '**/instrumentation*'
        ]
      }
      
      // Skip type checking in dev
      config.module.rules.forEach((rule) => {
        if (rule.loader === 'next-swc-loader') {
          rule.options = {
            ...rule.options,
            skipTypeCheck: true
          }
        }
      })
    }
    
    return config
  },
  
  // Experimental optimizations
  experimental: {
    optimizeCss: false, // Disable CSS optimization for faster builds
    optimizeServerReact: true,
    esmExternals: 'loose',
  }
};

export default nextConfig;
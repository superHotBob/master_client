const withPWA = require("next-pwa")
const  runtimeCaching = require('next-pwa/cache.js')
// const isProduction = process.env.NODE_ENV === 'production'
const config = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  }
}
const nextConfig = withPWA({
  dest: 'public',
  // disable: !isProduction,
  runtimeCaching
})(
  config
);

module.export = nextConfig;
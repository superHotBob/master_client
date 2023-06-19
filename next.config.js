const withPWA = require("next-pwa")
const  runtimeCaching = require('next-pwa/cache.js')
const isProduction = process.env.NODE_ENV === 'production'
const config = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  env: {
    url:  'https://masters-client.onrender.com/',    
  }
}
const nextConfig = withPWA({
  dest: 'public',
  disable: !isProduction,
  runtimeCaching
})(
  config
);

module.exports = nextConfig;
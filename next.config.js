const withPWA = require("next-pwa")
const  runtimeCaching = require('next-pwa/cache.js')
const isProduction = process.env.NODE_ENV === 'production'
const config = { 
  images: {
    unoptimized: true
  },
  env: {
    url:  'https://masters.place/', 
    url_new_image: 'http://masters.place:5000/var/data/',
    url_new: 'http://masters.place:5000/',
    url_image: 'https://masters.place/images/',
    pg_data: {
      user: 'client',
      host: '5.35.5.23',
      database: 'postgres',
      password: 'client123',
      port: 5432,
    }
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
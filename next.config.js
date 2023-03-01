/** @type {import('next').NextConfig} */
// const withPWA = require("next-pwa");
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  }
}
// module.exports = withPWA({
//   pwa: {
//     dest: "public",
//     register: true,
//     skipWaiting: true,
//   },
//   nextConfig
// });
module.exports = nextConfig

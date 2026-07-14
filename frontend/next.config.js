/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // room images are arbitrary URLs (per Room.image field) — allow any https host
    ],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /* Allow Supabase Storage images */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qjpomdhpvheudpduywjj.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  /* Required for Three.js / react-three-fiber */
  transpilePackages: ['three'],
};

module.exports = nextConfig;

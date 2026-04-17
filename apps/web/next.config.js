/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow importing `amplify/` and root `amplify_outputs.json` from the monorepo root
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;

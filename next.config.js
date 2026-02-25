/** @type {import('next').NextConfig} */
const nextConfig = {
  // Specify the output directory for the build.
  // This explicit setting might help Turbopack or Next.js resolve the project root correctly.
  distDir: '.next',
};

module.exports = nextConfig;
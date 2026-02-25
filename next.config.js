/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set the Turbopack root to the actual Vercel build directory.
  // This aims to fix the "inferred workspace root" error by providing the correct path.
  turbopack: {
    // Setting the root to the actual Vercel build path.
    // This is a workaround if __dirname isn't resolving as expected in Vercel's environment.
    root: '/vercel/path0',
  },
  // distDir is also important for Vercel context
  distDir: '.next',
};

module.exports = nextConfig;
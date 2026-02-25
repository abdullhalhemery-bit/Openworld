/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the Turbopack root explicitly to the project's root directory.
  // __dirname in the context of config files usually refers to the root.
  // Vercel builds in /vercel/path0, so relative paths need to be handled.
  // Turbopack's root should point to the directory containing next.config.js itself.
  turbopack: {
    // This is the key part to fix the "inferred workspace root" error.
    // The value should point to the project root directory.
    // In Next.js config, __dirname usually refers to the location of next.config.js.
    root: __dirname
  },
  // distDir is also important for Vercel context
  distDir: '.next',
};

module.exports = nextConfig;
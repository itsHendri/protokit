import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/**
 * A fully static site: `next build` writes out/, which Cloudflare serves as static assets with no
 * Worker script (see wrangler.jsonc). Everything that looks dynamic (search, llms.txt, install.md,
 * component pages) is generated at build time.
 */
/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default withMDX(config);

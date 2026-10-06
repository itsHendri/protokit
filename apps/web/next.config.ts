import type { NextConfig } from 'next';

/**
 * A normal Next app for prototypes. `KIT_WEB_EXPORT=1 next build` writes a static export instead, with
 * every route under KIT_WEB_BASE_PATH (the docs site embeds the kit at /w).
 */
const exporting = process.env.KIT_WEB_EXPORT === '1';
const basePath = process.env.KIT_WEB_BASE_PATH || undefined;

const config: NextConfig = {
  reactStrictMode: true,
  ...(exporting ? { output: 'export', trailingSlash: true, images: { unoptimized: true } } : {}),
  ...(basePath ? { basePath } : {}),
};

export default config;

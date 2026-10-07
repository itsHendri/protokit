/**
 * Storage keys and the pre-paint script for the live theme. A plain module (not 'use client') so the
 * root layout, a server component, can inline the script.
 */
export const STORAGE_KEY = 'protokit.theme';
/** The site's CSS for the current theme, painted before hydration. */
export const CSS_KEY = 'protokit.theme.css';
/** The kits' payloads, read before paint by the embedded kits (same origin). The kits read this key too. */
export const EMBED_KEY = 'kit.embed.theme';
export const STYLE_ID = 'protokit-theme';
export const FONTS_ID = 'protokit-theme-fonts';

/** Inline in <head>: the last theme's CSS before first paint, so a themed site never flashes the default. */
export const themeBootScript = `(function(){try{var c=localStorage.getItem('${CSS_KEY}');if(c){var s=document.createElement('style');s.id='${STYLE_ID}';s.textContent=c;document.head.appendChild(s)}}catch(e){}})();`;

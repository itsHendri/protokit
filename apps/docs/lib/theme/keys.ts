/**
 * Storage keys and the pre-paint script for the live theme. A plain module (not 'use client') so the
 * root layout, a server component, can inline the script.
 */
export const STORAGE_KEY = 'protokit.theme';
/** The site's CSS for the current theme, painted before hydration. */
export const CSS_KEY = 'protokit.theme.css';
/**
 * The kits' payloads, read before paint by the embedded kits (same origin). The kits read this key too. Not
 * `kit.embed.theme`: the web kit keeps the frame's light/dark there.
 */
export const EMBED_KEY = 'kit.embed.tokens';
export const STYLE_ID = 'protokit-theme';
export const FONTS_ID = 'protokit-theme-fonts';
/** The Google Fonts stylesheet for the current theme's fonts, linked before paint too. */
export const FONTS_KEY = 'protokit.theme.fonts';

/** Inline in <head>: the last theme's CSS before first paint, so a themed site never flashes the default. */
export const themeBootScript = `(function(){try{var c=localStorage.getItem('${CSS_KEY}');if(c){var s=document.createElement('style');s.id='${STYLE_ID}';s.textContent=c;document.head.appendChild(s)}
var f=localStorage.getItem('${FONTS_KEY}');if(c&&f&&f.indexOf('https://fonts.googleapis.com/')===0){var l=document.createElement('link');l.id='${FONTS_ID}';l.rel='stylesheet';l.href=f;document.head.appendChild(l)}}catch(e){}})();`;

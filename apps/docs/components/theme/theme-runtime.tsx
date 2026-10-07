'use client';
import * as React from 'react';
import { fontsHref, kitPayloads, siteCss } from '@/lib/theme/payload';
import { CSS_KEY, EMBED_KEY, FONTS_ID, FONTS_KEY, STYLE_ID } from '@/lib/theme/keys';
import { committed, currentRecipe, startTheme, subscribeTheme, themeFor } from '@/lib/theme/store';
import { sameRecipe } from '@itshendri/kit-tokens/theme';

/**
 * Puts the live theme on the site: a stylesheet over app/tokens.css (the chrome), a cached copy for the
 * next page load (the pre-paint script in app/layout.tsx), and the kits' payloads in sessionStorage so an
 * embedded kit paints the theme on its first frame. Renders nothing.
 */
export function ThemeRuntime() {
  React.useLayoutEffect(() => {
    const apply = () => {
      const recipe = currentRecipe();
      const theme = themeFor(recipe);
      const live = !sameRecipe(recipe, committed);
      let style = document.getElementById(STYLE_ID);
      try {
        sessionStorage.setItem(EMBED_KEY, JSON.stringify(kitPayloads(theme, live)));
      } catch {
        /* storage unavailable: the frames still get the theme over postMessage */
      }
      const href = live ? fontsHref(theme) : null;
      let link = document.getElementById(FONTS_ID) as HTMLLinkElement | null;
      if (!href) link?.remove();
      else {
        if (!link) {
          link = Object.assign(document.createElement('link'), { id: FONTS_ID, rel: 'stylesheet' });
          document.head.appendChild(link);
        }
        if (link.href !== href) link.href = href;
      }
      try {
        if (href) localStorage.setItem(FONTS_KEY, href);
        else localStorage.removeItem(FONTS_KEY);
      } catch {}
      if (!live) {
        style?.remove();
        try {
          localStorage.removeItem(CSS_KEY);
        } catch {}
        return;
      }
      const css = siteCss(theme);
      if (!style) {
        style = document.createElement('style');
        style.id = STYLE_ID;
        document.head.appendChild(style);
      }
      if (style.textContent !== css) style.textContent = css;
      try {
        localStorage.setItem(CSS_KEY, css);
      } catch {}
    };
    startTheme();
    apply();
    return subscribeTheme(apply);
  }, []);
  return null;
}

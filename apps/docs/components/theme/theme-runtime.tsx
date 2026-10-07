'use client';
import * as React from 'react';
import { kitPayloads, siteCss } from '@/lib/theme/payload';
import { CSS_KEY, EMBED_KEY, STYLE_ID } from '@/lib/theme/keys';
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

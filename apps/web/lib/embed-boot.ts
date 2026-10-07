/**
 * The part of embed mode that runs before React: a tiny script in <head> (rendered by the root layout, a
 * server component) that marks <html data-embed> so the kit chrome never flashes. See lib/embed.ts.
 */
import { EMBED_THEME_KEY, OVERRIDE_STYLE_ID } from '@/lib/embed-theme';

export const EMBED_STORAGE = 'kit.embed';

/**
 * Runs in <head> before paint: marks <html>, stores the session's embed state and, when embedded, paints the
 * docs picker's live theme cached by the docs site (lib/embed-theme.ts has the same checks and selectors). sessionStorage is shared
 * by a tab and its same-origin iframes, so a page that is not framed and has no ?embed clears it: opening
 * the kit directly after the docs never inherits embed mode.
 */
export const embedBootScript = `(function(){try{var p=new URLSearchParams(location.search);var s=sessionStorage;
if(p.get('embed')==='1'){s.setItem('${EMBED_STORAGE}','1')}
else if(window.top===window){s.removeItem('${EMBED_STORAGE}');s.removeItem('${EMBED_STORAGE}.theme')}
var t=p.get('theme');if(t==='light'||t==='dark'){s.setItem('${EMBED_STORAGE}.theme',t)}
if(s.getItem('${EMBED_STORAGE}')==='1'){document.documentElement.dataset.embed='1';
var c=JSON.parse(s.getItem('${EMBED_THEME_KEY}')||'null'),v=c&&c.code&&c.web&&c.web.vars;
if(v){var b=function(sel,m){var o='';for(var k in m||{}){var x=String(m[k]);
if(/^--[a-z0-9-]{1,40}$/.test(k)&&/^[\\w.%\\s(),#/-]{1,80}$/.test(x)&&!/url/i.test(x)){o+=k+':'+x+';'}}return sel+'{'+o+'}'};
var st=document.createElement('style');st.id='${OVERRIDE_STYLE_ID}';st.textContent=b(':root:root:root',v.light)+b('.dark:root:root:root',v.dark);
document.head.appendChild(st)}}}catch(e){}})();`;


/**
 * The part of embed mode that runs before React: a tiny script in <head> (rendered by the root layout, a
 * server component) that marks <html data-embed> so the kit chrome never flashes. See lib/embed.ts.
 */
export const EMBED_STORAGE = 'kit.embed';

/**
 * Runs in <head> before paint: marks <html> and stores the session's embed state. sessionStorage is shared
 * by a tab and its same-origin iframes, so a page that is not framed and has no ?embed clears it: opening
 * the kit directly after the docs never inherits embed mode.
 */
export const embedBootScript = `(function(){try{var p=new URLSearchParams(location.search);var s=sessionStorage;
if(p.get('embed')==='1'){s.setItem('${EMBED_STORAGE}','1')}
else if(window.top===window){s.removeItem('${EMBED_STORAGE}');s.removeItem('${EMBED_STORAGE}.theme')}
var t=p.get('theme');if(t==='light'||t==='dark'){s.setItem('${EMBED_STORAGE}.theme',t)}
if(s.getItem('${EMBED_STORAGE}')==='1'){document.documentElement.dataset.embed='1'}}catch(e){}})();`;


import { colorNames } from '@/lib/kit';

/**
 * Every semantic colour, painted with the site's own CSS variables (generated from the kit's tokens.json),
 * so the swatches follow the theme toggle like the rest of the page.
 */
export function TokenSwatches() {
  const bases = colorNames.filter((n) => !n.endsWith('-foreground'));
  return (
    <ul className="not-prose grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {bases.map((name) => {
        const fg = colorNames.includes(`${name}-foreground`) ? `${name}-foreground` : null;
        return (
          <li key={name} className="border-border overflow-hidden rounded-xl border">
            <div
              className="flex h-16 items-end p-2 text-sm font-medium"
              style={{ background: `var(--${name})`, color: fg ? `var(--${fg})` : undefined }}>
              {fg ? 'Aa' : null}
            </div>
            <div className="bg-card p-2">
              <code className="text-xs">{name}</code>
              {fg ? <p className="text-muted-foreground text-xs">+ {fg}</p> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

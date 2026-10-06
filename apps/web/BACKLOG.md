# Backlog

Durable, human- and agent-readable list of deferred work. Update when you defer or finish something.

_Last updated: 2026-10-07_

## Components
- **ToolCallCard has no "stopped" status.** The assistant sample marks a tool the person stopped as `error`,
  which reads "Failed". Add a neutral `stopped` (or `cancelled`) state to `components/kit/tool-call-card.tsx`
  and the registry API line.
- **No chat thread list or attachments.** The assistant sample is one conversation; a sidebar of past chats
  (AppShell can host it) and file chips in ChatComposer are the next AI-UI pieces prototypes ask for.
- **Gap analysis vs. shadcn blocks and Halaska's AI patterns** has not been done for the web kit; the mobile
  kit's BACKLOG has the equivalent for native.
- **Not yet installed from shadcn:** calendar / date picker, pagination, hover-card, navigation-menu,
  context-menu, input-otp, drawer, carousel, resizable, sidebar (AppShell covers the common case).

## Samples
- The samples share one made-up product (Northwind) but not one store: the assistant's "sent reminders" does
  not change the dashboard's invoices. Fine for showing patterns; revisit if a client wants a joined-up demo.

## Tooling
- **Figma:** `npm run tokens:figma` pushes the tokens; Code Connect for the web components once they settle.
- **Lighthouse in CI** for the kit pages (the docs site is checked by hand today).

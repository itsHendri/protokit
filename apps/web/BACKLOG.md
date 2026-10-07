# Backlog

Durable, human- and agent-readable list of deferred work. Update when you defer or finish something.

_Last updated: 2026-10-07_

## Components
- **No attachments in ChatComposer.** File chips (name, size, remove) are the next AI-UI piece prototypes ask
  for. (Thread history landed as ChatThreadList; ToolCallCard has a `stopped` status.)
- **Gap analysis vs. shadcn blocks and Halaska's AI patterns** has not been done for the web kit; the mobile
  kit's BACKLOG has the equivalent for native.
- **Not yet installed from shadcn:** hover-card, context-menu, input-otp, carousel, resizable, sidebar
  (AppShell covers the common case). Calendar, pagination, navigation-menu and drawer are in.

## Samples
- The samples share one made-up product (Northwind) but not one store: the assistant's "sent reminders" does
  not change the dashboard's invoices. Fine for showing patterns; revisit if a client wants a joined-up demo.

## Tooling
- **Figma:** `npm run tokens:figma` pushes the tokens; Code Connect for the web components once they settle.
- **Lighthouse in CI** for the kit pages (the docs site is checked by hand today).

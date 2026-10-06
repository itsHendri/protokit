import type { Metadata } from 'next';
import { Providers } from '@/components/site/providers';
import { embedBootScript } from '@/lib/embed-boot';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Prototype Kit (web)', template: '%s · Prototype Kit' },
  description: 'A themeable Next.js + shadcn/ui starter for web prototypes, built only from registered components.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Before paint, so embedded pages never flash the kit chrome. */}
        <script dangerouslySetInnerHTML={{ __html: embedBootScript }} />
      </head>
      <body className="bg-background text-foreground min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

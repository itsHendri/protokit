'use client';
import { SquarePenIcon } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { KitChip } from '@/components/site/kit-chip';
import { Button } from '@/components/ui/button';
import { Conversation } from './conversation';

/** The assistant sample's page: a header and one conversation. "New chat" remounts the conversation. */
export function AssistantView() {
  const [chat, setChat] = React.useState(0);
  return (
    <div className="flex h-dvh flex-col">
      <header className="border-border flex h-14 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
        <Link href="/assistant" className="flex items-center gap-2 font-semibold">
          <span aria-hidden className="bg-primary size-5 rounded-md" />
          Northwind <span className="text-muted-foreground hidden font-normal sm:inline">Assistant</span>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <KitChip />
          <Button variant="ghost" size="sm" onClick={() => setChat((n) => n + 1)}>
            <SquarePenIcon aria-hidden />
            <span className="sr-only sm:not-sr-only">New chat</span>
          </Button>
        </div>
      </header>
      <Conversation key={chat} />
    </div>
  );
}

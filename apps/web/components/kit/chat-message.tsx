import { BotIcon } from 'lucide-react';
import { cn } from 'cn';
import type * as React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Props = {
  role: 'user' | 'assistant';
  /** Text, StreamingText, a ToolCallCard, an ApprovalCard: anything the turn contains. */
  children: React.ReactNode;
  /** Shown for the user's avatar. */
  initials?: string;
  className?: string;
};

/**
 * One turn in a conversation. The user's turn is a bubble on the right; the assistant's is plain text on
 * the left, so long answers read like a document, not a chat bubble.
 */
export function ChatMessage({ role, children, initials = 'You', className }: Props) {
  const user = role === 'user';
  return (
    <div className={cn('flex gap-3', user && 'flex-row-reverse', className)}>
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className={cn('text-xs', !user && 'bg-primary text-primary-foreground')}>
          {user ? initials.slice(0, 2) : <BotIcon className="size-4" aria-label="Assistant" />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'flex min-w-0 flex-col gap-3 leading-7',
          user ? 'bg-muted max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2.5' : 'flex-1 pt-1'
        )}>
        {children}
      </div>
    </div>
  );
}

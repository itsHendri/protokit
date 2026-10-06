'use client';
import { ArrowUpIcon, SquareIcon } from 'lucide-react';
import { cn } from 'cn';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  onSend: (text: string) => void;
  /** While the assistant answers: the send button becomes Stop. */
  busy?: boolean;
  onStop?: () => void;
  placeholder?: string;
  className?: string;
};

/** Where the user writes. Enter sends, Shift+Enter adds a line. */
export function ChatComposer({ onSend, busy, onStop, placeholder = 'Ask anything', className }: Props) {
  const [value, setValue] = React.useState('');
  const id = React.useId();
  const send = () => {
    const text = value.trim();
    if (!text || busy) return;
    onSend(text);
    setValue('');
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      className={cn('border-input bg-card focus-within:ring-ring/50 flex items-end gap-2 rounded-2xl border p-2 focus-within:ring-[3px]', className)}>
      <label htmlFor={id} className="sr-only">
        Message
      </label>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        placeholder={placeholder}
        rows={1}
        className="max-h-40 min-h-10 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
      />
      {busy ? (
        <Button type="button" size="icon" variant="secondary" className="rounded-full" onClick={onStop} aria-label="Stop answering">
          <SquareIcon />
        </Button>
      ) : (
        <Button type="submit" size="icon" className="rounded-full" disabled={!value.trim()} aria-label="Send">
          <ArrowUpIcon />
        </Button>
      )}
    </form>
  );
}

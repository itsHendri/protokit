'use client';
import { CheckCircle2Icon, ChevronDownIcon, CircleAlertIcon, LoaderCircleIcon, WrenchIcon } from 'lucide-react';
import { cn } from 'cn';
import * as React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type Props = {
  /** What the tool does, in words: "Searched orders", not "search_orders". */
  title: string;
  status: 'running' | 'done' | 'error';
  /** The call's inputs and result, for people who want to check. Collapsed by default. */
  input?: string;
  output?: string;
  className?: string;
};

const STATUS = {
  running: { icon: LoaderCircleIcon, label: 'Running', tone: 'text-muted-foreground', spin: true },
  done: { icon: CheckCircle2Icon, label: 'Done', tone: 'text-success', spin: false },
  error: { icon: CircleAlertIcon, label: 'Failed', tone: 'text-destructive', spin: false },
} as const;

/** One action the assistant took, shown in the conversation so people can see what it did. */
export function ToolCallCard({ title, status, input, output, className }: Props) {
  const s = STATUS[status];
  const details = input || output;
  return (
    <Collapsible className={cn('border-border bg-card rounded-xl border text-sm', className)}>
      <CollapsibleTrigger
        disabled={!details}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left disabled:cursor-default [&[data-state=open]>svg:last-child]:rotate-180">
        <WrenchIcon className="text-muted-foreground size-4 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1 truncate font-medium">{title}</span>
        <span className={cn('inline-flex items-center gap-1', s.tone)}>
          <s.icon className={cn('size-4', s.spin && 'animate-spin motion-reduce:animate-none')} aria-hidden />
          {s.label}
        </span>
        {details ? <ChevronDownIcon className="text-muted-foreground size-4 transition-transform" aria-hidden /> : null}
      </CollapsibleTrigger>
      {details ? (
        <CollapsibleContent className="border-border flex flex-col gap-2 border-t px-3 py-2.5">
          {input ? <pre className="bg-muted overflow-x-auto rounded-md p-2 font-mono text-xs">{input}</pre> : null}
          {output ? <pre className="bg-muted overflow-x-auto rounded-md p-2 font-mono text-xs">{output}</pre> : null}
        </CollapsibleContent>
      ) : null}
    </Collapsible>
  );
}

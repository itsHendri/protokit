'use client';
import { ExternalLinkIcon, FileTextIcon } from 'lucide-react';
import { cn } from 'cn';
import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type Source = {
  title: string;
  /** Where it lives: "Invoice · 28 May", "help.northwind.co". */
  meta?: string;
  /** The passage the answer used, one or two sentences. */
  snippet?: string;
  href?: string;
};

function Preview({ n, source }: { n: number; source: Source }) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p className="flex items-start gap-2 font-medium">
        <span className="bg-muted text-foreground flex size-5 shrink-0 items-center justify-center rounded text-xs tabular-nums">{n}</span>
        {source.title}
      </p>
      {source.meta ? <p className="text-muted-foreground text-xs">{source.meta}</p> : null}
      {source.snippet ? <blockquote className="border-border text-muted-foreground border-l-2 pl-3 leading-6">{source.snippet}</blockquote> : null}
      {source.href ? (
        <a href={source.href} target="_blank" rel="noreferrer" className="text-foreground inline-flex items-center gap-1 text-xs font-medium underline underline-offset-4">
          Open source <ExternalLinkIcon className="size-3" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}

/** The sources under an answer: numbered chips, each opening a preview of what was used. */
export function SourceList({ sources, label = 'Sources', className }: { sources: Source[]; label?: string; className?: string }) {
  const id = React.useId();
  if (!sources.length) return null;
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p id={id} className="text-muted-foreground text-xs font-medium">
        {label}
      </p>
      <ol aria-labelledby={id} className="flex flex-wrap gap-2">
        {sources.map((s, i) => (
          <li key={`${s.title}-${i}`}>
            <Popover>
              <PopoverTrigger className="border-border bg-card hover:bg-accent focus-visible:ring-ring flex max-w-60 items-center gap-2 rounded-lg border px-2 py-1 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none">
                <span className="bg-muted flex size-4 shrink-0 items-center justify-center rounded text-xs leading-none font-medium tabular-nums">{i + 1}</span>
                <FileTextIcon className="text-muted-foreground size-3.5 shrink-0" aria-hidden />
                <span className="truncate">{s.title}</span>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80">
                <Preview n={i + 1} source={s} />
              </PopoverContent>
            </Popover>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * An answer with inline citations: every `[n]` in `text` becomes a small numbered button that opens the
 * nth source's preview. While an answer streams, show it with `stripCitations` instead.
 */
export function CitedText({ text, sources, className }: { text: string; sources: Source[]; className?: string }) {
  const parts = text.split(/(\[\d+\])/g);
  return (
    <p className={className}>
      {parts.map((part, i) => {
        const n = /^\[(\d+)\]$/.exec(part)?.[1];
        const source = n ? sources[Number(n) - 1] : undefined;
        if (!n || !source) return <React.Fragment key={i}>{part}</React.Fragment>;
        return (
          <Popover key={i}>
            <PopoverTrigger
              aria-label={`Source ${n}: ${source.title}`}
              className="bg-muted text-foreground hover:bg-accent focus-visible:ring-ring mx-0.5 inline-flex h-4 min-w-4 -translate-y-1 items-center justify-center rounded px-0.5 align-baseline text-xs leading-none font-medium tabular-nums focus-visible:ring-2 focus-visible:outline-none">
              {n}
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80">
              <Preview n={Number(n)} source={source} />
            </PopoverContent>
          </Popover>
        );
      })}
    </p>
  );
}

/** The answer without its `[n]` markers, for StreamingText. */
export const stripCitations = (text: string) => text.replace(/\s?\[\d+\]/g, '');

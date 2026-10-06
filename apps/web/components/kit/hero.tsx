import { cn } from 'cn';
import type * as React from 'react';

type Props = {
  /** Short line above the title: a category, a launch, "New". */
  eyebrow?: React.ReactNode;
  title: string;
  description?: string;
  /** One primary Button and at most one secondary. */
  actions?: React.ReactNode;
  /** A product shot, illustration or Placeholder. Omit for a centred text hero. */
  media?: React.ReactNode;
  className?: string;
};

/** The top of a marketing page: one promise, one primary action. */
export function Hero({ eyebrow, title, description, actions, media, className }: Props) {
  return (
    <section
      className={cn(
        'grid items-center gap-10 py-16 md:py-24',
        media ? 'lg:grid-cols-2' : 'mx-auto max-w-3xl text-center',
        className
      )}>
      <div className={cn('flex flex-col gap-5', !media && 'items-center')}>
        {eyebrow ? <p className="text-primary text-sm font-semibold">{eyebrow}</p> : null}
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h1>
        {description ? <p className="text-muted-foreground max-w-xl text-lg leading-8">{description}</p> : null}
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {media ? <div className="min-w-0">{media}</div> : null}
    </section>
  );
}

import { cn } from 'cn';

type Props = { label?: string; className?: string };

/** "The model is working": three dots and a label. Still dots under reduced motion. */
export function ThinkingIndicator({ label = 'Thinking', className }: Props) {
  return (
    <div role="status" className={cn('text-muted-foreground inline-flex items-center gap-2 text-sm', className)}>
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="bg-muted-foreground size-1.5 animate-bounce rounded-full motion-reduce:animate-none"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
      {label}
    </div>
  );
}

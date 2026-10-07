import { cn } from 'cn';
import { Button } from '@/components/ui/button';

type Props = {
  /** Two to four next questions, phrased the way the person would ask them. */
  suggestions: string[];
  onSelect: (text: string) => void;
  className?: string;
};

/** Next questions under the latest answer. Picking one sends it. Hide them while the assistant answers. */
export function FollowUpSuggestions({ suggestions, onSelect, className }: Props) {
  if (!suggestions.length) return null;
  return (
    <div role="group" aria-label="Suggested follow-ups" className={cn('flex flex-wrap gap-2', className)}>
      {suggestions.map((s) => (
        <Button key={s} type="button" variant="outline" size="sm" className="h-auto rounded-full py-1.5 text-left whitespace-normal" onClick={() => onSelect(s)}>
          {s}
        </Button>
      ))}
    </div>
  );
}

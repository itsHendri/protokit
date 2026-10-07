import { FileTextIcon, ImageIcon, XIcon } from 'lucide-react';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';

export type Attachment = { name: string; size: number; type?: string };

/** 1234 → "1.2 KB". */
export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

type Props = {
  file: Attachment;
  /** Shows a remove button (in the composer, before sending). Omit in a sent message. */
  onRemove?: () => void;
  className?: string;
};

/** A file in a conversation: an icon by type, the name and the size. Removable while composing. */
export function AttachmentChip({ file, onRemove, className }: Props) {
  const Icon = file.type?.startsWith('image/') ? ImageIcon : FileTextIcon;
  return (
    <span className={cn('border-border bg-card flex max-w-64 items-center gap-2 rounded-lg border py-1.5 pr-1.5 pl-2.5 text-sm', className)}>
      <Icon className="text-muted-foreground size-4 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1 truncate font-medium">{file.name}</span>
      <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{formatBytes(file.size)}</span>
      {onRemove ? (
        <Button type="button" variant="ghost" size="icon" className="size-6 shrink-0" onClick={onRemove} aria-label={`Remove ${file.name}`}>
          <XIcon className="size-3.5" />
        </Button>
      ) : null}
    </span>
  );
}

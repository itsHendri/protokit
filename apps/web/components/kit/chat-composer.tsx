'use client';
import { ArrowUpIcon, PaperclipIcon, SquareIcon } from 'lucide-react';
import { cn } from 'cn';
import * as React from 'react';
import { AttachmentChip } from '@/components/kit/attachment-chip';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  /** The message, and any files attached to it (an empty array when attachments are off or none). */
  onSend: (text: string, files: File[]) => void;
  /** While the assistant answers: the send button becomes Stop. */
  busy?: boolean;
  onStop?: () => void;
  placeholder?: string;
  /**
   * Turns on attachments: a paperclip button, dropping files on the composer, and chips to review and
   * remove them before sending. The value is the file input's `accept` ("image/*,.pdf"; "" for any).
   */
  accept?: string;
  /** At most this many files per message (default 5). */
  maxFiles?: number;
  className?: string;
};

/** Where the user writes. Enter sends, Shift+Enter adds a line. Can carry files when `accept` is set. */
export function ChatComposer({ onSend, busy, onStop, placeholder = 'Ask anything', accept, maxFiles = 5, className }: Props) {
  const [value, setValue] = React.useState('');
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const id = React.useId();
  const picker = React.useRef<HTMLInputElement>(null);
  const attachments = accept !== undefined;

  const add = (list: FileList | null) => {
    if (!list?.length) return;
    setFiles((fs) => [...fs, ...Array.from(list)].slice(0, maxFiles));
  };

  const send = () => {
    const text = value.trim();
    if ((!text && !files.length) || busy) return;
    onSend(text, files);
    setValue('');
    setFiles([]);
  };

  const canSend = !!value.trim() || files.length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      onDragOver={
        attachments
          ? (e) => {
              if (!e.dataTransfer.types.includes('Files')) return;
              e.preventDefault();
              setDragging(true);
            }
          : undefined
      }
      onDragLeave={attachments ? () => setDragging(false) : undefined}
      onDrop={
        attachments
          ? (e) => {
              e.preventDefault();
              setDragging(false);
              add(e.dataTransfer.files);
            }
          : undefined
      }
      className={cn(
        'border-input bg-card focus-within:ring-ring/50 flex flex-col gap-2 rounded-2xl border p-2 focus-within:ring-[3px]',
        dragging && 'border-primary ring-ring/50 ring-[3px]',
        className
      )}>
      {files.length ? (
        <ul aria-label="Attachments" className="flex flex-wrap gap-2 px-1 pt-1">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              <AttachmentChip file={f} onRemove={() => setFiles((fs) => fs.filter((_, j) => j !== i))} />
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex items-end gap-2">
        {attachments ? (
          <>
            <input
              ref={picker}
              type="file"
              multiple={maxFiles > 1}
              accept={accept || undefined}
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={(e) => {
                add(e.target.files);
                e.target.value = '';
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Attach files"
              disabled={files.length >= maxFiles}
              onClick={() => picker.current?.click()}>
              <PaperclipIcon />
            </Button>
          </>
        ) : null}
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
          <Button type="submit" size="icon" className="rounded-full" disabled={!canSend} aria-label="Send">
            <ArrowUpIcon />
          </Button>
        )}
      </div>
    </form>
  );
}

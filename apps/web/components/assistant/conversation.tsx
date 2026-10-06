'use client';
import { CheckIcon, SparklesIcon, XIcon } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { ApprovalCard } from '@/components/kit/approval-card';
import { ChatComposer } from '@/components/kit/chat-composer';
import { ChatMessage } from '@/components/kit/chat-message';
import { EmptyState } from '@/components/kit/empty-state';
import { StreamingText } from '@/components/kit/streaming-text';
import { ThinkingIndicator } from '@/components/kit/thinking-indicator';
import { ToolCallCard } from '@/components/kit/tool-call-card';
import { Button } from '@/components/ui/button';
import { scriptFor, SUGGESTIONS, type Step } from './script';

type AskStep = Extract<Step, { kind: 'ask' }>;
type Part =
  | { id: string; kind: 'thinking' }
  | { id: string; kind: 'tool'; title: string; status: 'running' | 'done' | 'error'; input?: string; output?: string }
  | { id: string; kind: 'text'; text: string; streaming: boolean }
  | { id: string; kind: 'ask'; step: AskStep; decision?: 'approved' | 'denied' };
type Turn = { id: string; role: 'user' | 'assistant'; parts: Part[] };

let seq = 0;
const nextId = () => `t${++seq}`;

class Stopped extends Error {}

/**
 * The AI conversation pattern, scripted: thinking → a tool call you can inspect → a streamed answer → an
 * approval before anything is sent. Stop works at every step.
 */
export function Conversation() {
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [busy, setBusy] = React.useState(false);
  const run = React.useRef<AbortController | null>(null);
  const streams = React.useRef(new Map<string, () => void>());
  const scroller = React.useRef<HTMLDivElement>(null);
  const content = React.useRef<HTMLDivElement>(null);

  // A new chat (the header button remounts this) or leaving the page stops whatever is running.
  React.useEffect(() => () => run.current?.abort(), []);

  // Stay pinned to the bottom while the answer grows, unless the reader has scrolled up.
  React.useEffect(() => {
    const el = scroller.current;
    const inner = content.current;
    if (!el || !inner) return;
    let pinned = true;
    const onScroll = () => {
      pinned = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    };
    const ro = new ResizeObserver(() => {
      if (pinned) el.scrollTop = el.scrollHeight;
    });
    el.addEventListener('scroll', onScroll, { passive: true });
    ro.observe(inner);
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, []);

  const patchTurn = (turnId: string, fn: (parts: Part[]) => Part[]) =>
    setTurns((ts) => ts.map((t) => (t.id === turnId ? { ...t, parts: fn(t.parts) } : t)));

  async function play(turnId: string, steps: Step[], signal: AbortSignal) {
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const t = setTimeout(resolve, ms);
        signal.addEventListener('abort', () => (clearTimeout(t), reject(new Stopped())), { once: true });
      });
    for (const step of steps) {
      const id = nextId();
      if (step.kind === 'think') {
        patchTurn(turnId, (p) => [...p, { id, kind: 'thinking' }]);
        await wait(step.ms);
        patchTurn(turnId, (p) => p.filter((x) => x.id !== id));
      } else if (step.kind === 'tool') {
        patchTurn(turnId, (p) => [...p, { id, kind: 'tool', title: step.title, status: 'running', input: step.input }]);
        await wait(step.ms);
        patchTurn(turnId, (p) => p.map((x) => (x.id === id ? { ...x, status: 'done', output: step.output } : x)));
      } else if (step.kind === 'say') {
        const finished = new Promise<void>((resolve, reject) => {
          streams.current.set(id, resolve);
          signal.addEventListener('abort', () => reject(new Stopped()), { once: true });
        });
        patchTurn(turnId, (p) => [...p, { id, kind: 'text', text: step.text, streaming: true }]);
        await finished;
      } else {
        patchTurn(turnId, (p) => [...p, { id, kind: 'ask', step }]);
      }
    }
  }

  async function start(turnId: string, steps: Step[]) {
    run.current?.abort();
    const controller = new AbortController();
    run.current = controller;
    setBusy(true);
    try {
      await play(turnId, steps, controller.signal);
    } catch (e) {
      if (!(e instanceof Stopped)) throw e;
      patchTurn(turnId, (parts) => [
        ...parts
          .filter((x) => x.kind !== 'thinking')
          .map((x) => (x.kind === 'tool' && x.status === 'running' ? { ...x, status: 'error' as const, output: 'Stopped before it finished.' } : x))
          .map((x) => (x.kind === 'text' && x.streaming ? { ...x, streaming: false } : x)),
        { id: nextId(), kind: 'text', text: 'You stopped this answer.', streaming: false },
      ]);
    } finally {
      if (run.current === controller) {
        run.current = null;
        setBusy(false);
      }
    }
  }

  const send = (text: string) => {
    const turnId = nextId();
    setTurns((ts) => [...ts, { id: nextId(), role: 'user', parts: [{ id: nextId(), kind: 'text', text, streaming: false }] }, { id: turnId, role: 'assistant', parts: [] }]);
    void start(turnId, scriptFor(text));
  };

  const streamed = (turnId: string, partId: string) => {
    const resolve = streams.current.get(partId);
    if (!resolve) return;
    streams.current.delete(partId);
    patchTurn(turnId, (p) => p.map((x) => (x.id === partId && x.kind === 'text' ? { ...x, streaming: false } : x)));
    resolve();
  };

  const decide = (turnId: string, part: Extract<Part, { kind: 'ask' }>, decision: 'approved' | 'denied') => {
    patchTurn(turnId, (p) => p.map((x) => (x.id === part.id ? { ...part, decision } : x)));
    if (decision === 'approved') toast.success(part.step.title);
    void start(turnId, decision === 'approved' ? part.step.onApprove : part.step.onDeny);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        <div ref={content} className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
          {turns.length === 0 ? (
            <EmptyState
              icon={SparklesIcon}
              title="Ask about your invoices"
              description="The assistant reads Northwind’s invoices and can send reminders, always asking first."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={() => send(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              }
            />
          ) : (
            turns.map((turn) => (
              <ChatMessage key={turn.id} role={turn.role} initials="AM">
                {turn.parts.map((part) => {
                  switch (part.kind) {
                    case 'thinking':
                      return <ThinkingIndicator key={part.id} label="Thinking" />;
                    case 'tool':
                      return <ToolCallCard key={part.id} title={part.title} status={part.status} input={part.input} output={part.output} />;
                    case 'text':
                      return part.streaming ? (
                        <StreamingText key={part.id} text={part.text} onDone={() => streamed(turn.id, part.id)} />
                      ) : (
                        <p key={part.id}>{part.text}</p>
                      );
                    case 'ask':
                      return part.decision ? (
                        <p key={part.id} className="text-muted-foreground flex items-center gap-2 text-sm">
                          {part.decision === 'approved' ? <CheckIcon className="text-success size-4" aria-hidden /> : <XIcon className="size-4" aria-hidden />}
                          {part.decision === 'approved' ? 'You approved' : 'You declined'}: {part.step.title}
                        </p>
                      ) : (
                        <ApprovalCard
                          key={part.id}
                          title={part.step.title}
                          description={part.step.description}
                          details={part.step.details}
                          approveLabel={part.step.approveLabel}
                          onApprove={() => decide(turn.id, part, 'approved')}
                          onDeny={() => decide(turn.id, part, 'denied')}
                        />
                      );
                  }
                })}
              </ChatMessage>
            ))
          )}
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 pb-4 sm:px-6">
        <ChatComposer onSend={send} busy={busy} onStop={() => run.current?.abort()} placeholder="Ask about your invoices" />
        <p className="text-muted-foreground text-center text-xs">A scripted prototype: answers come from components/assistant/script.ts.</p>
      </div>
    </div>
  );
}

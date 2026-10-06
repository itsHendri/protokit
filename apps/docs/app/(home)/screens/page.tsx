import type { Metadata } from 'next';
import Link from 'next/link';
import { PhoneFrame } from '@/components/phone-frame';
import { kit } from '@/lib/kit';

export const metadata: Metadata = {
  title: 'Screens',
  description: `Sample apps and screens built only from the ${kit.name} mobile kit, running live.`,
};

const SCREENS = [
  { path: '/shop', title: 'Shop: browse', note: 'Filter chips, product tiles, the shop’s own tab bar.' },
  { path: '/shop/cart', title: 'Shop: cart', note: 'List rows, quantity steppers, a sticky checkout bar.' },
  { path: '/habits', title: 'Habits: today', note: 'Progress rings, selectable cards, daily goals.' },
  { path: '/habits/insights', title: 'Habits: insights', note: 'Charts and stat tiles on the same tokens.' },
  { path: '/kitchen-sink?open=inputs', title: 'Kitchen Sink: inputs', note: 'Every field, toggle and picker in the kit.' },
  { path: '/foundations?open=color', title: 'Foundations: colour', note: 'The semantic tokens, light and dark.' },
];

export default function ScreensPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 md:py-16">
      <header className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Screens</h1>
        <p className="text-muted-foreground text-lg leading-8">
          The two sample apps are built only from the kit and are the worked examples an agent follows. Every frame
          below is the real app running in the browser: scroll, tap and type in it. They follow this site&apos;s theme.
        </p>
        <p className="text-muted-foreground text-sm">
          On a phone: clone the kit and run it in Expo Go or a development build. See{' '}
          <Link href="/docs/mobile" className="underline underline-offset-4">
            Mobile setup
          </Link>
          .
        </p>
      </header>
      <ul className="grid justify-items-center gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {SCREENS.map((s) => (
          <li key={s.path} className="flex flex-col items-center gap-3">
            <PhoneFrame path={s.path} title={`${s.title}, live`} width={270} />
            <div className="max-w-[270px] text-center">
              <p className="font-medium">{s.title}</p>
              <p className="text-muted-foreground text-sm">{s.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

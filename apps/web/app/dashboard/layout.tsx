import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/shell';

export const metadata: Metadata = { title: 'Northwind dashboard' };

/** Sample: a SaaS dashboard (overview, a table, settings) built only from registry components. */
export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return <DashboardShell>{children}</DashboardShell>;
}

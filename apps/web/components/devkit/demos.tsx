'use client';
/**
 * Kitchen Sink demos, keyed by the component id in registry/components.ts. Each one is self-contained
 * (owns its state) and shows the variants and states that matter.
 */
import {
  BarChart3Icon,
  BoldIcon,
  CircleAlertIcon,
  CreditCardIcon,
  FileTextIcon,
  HomeIcon,
  InboxIcon,
  ItalicIcon,
  LayoutGridIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';
import type { ComponentType } from 'react';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { toast } from 'sonner';
import { AppShell } from '@/components/kit/app-shell';
import { ApprovalCard } from '@/components/kit/approval-card';
import { ChatComposer } from '@/components/kit/chat-composer';
import { ChatMessage } from '@/components/kit/chat-message';
import { DataTable } from '@/components/kit/data-table';
import { EmptyState } from '@/components/kit/empty-state';
import { FeatureGrid } from '@/components/kit/feature-grid';
import { Hero } from '@/components/kit/hero';
import { PageHeader } from '@/components/kit/page-header';
import { PricingCard } from '@/components/kit/pricing-card';
import { StatTile } from '@/components/kit/stat-tile';
import { StreamingText } from '@/components/kit/streaming-text';
import { ThinkingIndicator } from '@/components/kit/thinking-indicator';
import { ToolCallCard } from '@/components/kit/tool-call-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const Row = ({ children }: { children: React.ReactNode }) => <div className="flex flex-wrap items-center gap-3">{children}</div>;

const INVOICES = [
  { id: 'INV-1042', customer: 'Northwind', status: 'Paid', amount: 1240 },
  { id: 'INV-1043', customer: 'Acme Studio', status: 'Due', amount: 860 },
  { id: 'INV-1044', customer: 'Lumen Labs', status: 'Overdue', amount: 2310 },
];

const STATUS_CLASS: Record<string, string> = {
  Paid: 'bg-success/15 text-success',
  Due: 'bg-muted text-foreground',
  Overdue: 'bg-destructive/15 text-destructive',
};

const chartConfig = { visitors: { label: 'Visitors', color: 'var(--chart-1)' } } satisfies ChartConfig;
const chartData = [
  { month: 'Jan', visitors: 186 },
  { month: 'Feb', visitors: 305 },
  { month: 'Mar', visitors: 237 },
  { month: 'Apr', visitors: 273 },
  { month: 'May', visitors: 209 },
  { month: 'Jun', visitors: 314 },
];

function ChatDemo() {
  const [turns, setTurns] = React.useState<string[]>([]);
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      {turns.map((t, i) => (
        <ChatMessage key={i} role="user" initials="AM">
          {t}
        </ChatMessage>
      ))}
      <ChatComposer onSend={(t) => setTurns((x) => [...x, t])} placeholder="Type and press Enter" />
    </div>
  );
}

function StreamingDemo() {
  const [run, setRun] = React.useState(0);
  return (
    <div className="flex max-w-xl flex-col items-start gap-3">
      <StreamingText
        key={run}
        className="leading-7"
        text="Your three overdue invoices total £4,410. Lumen Labs is the largest at £2,310 and is 12 days late; I can draft a reminder."
      />
      <Button size="sm" variant="outline" onClick={() => setRun((r) => r + 1)}>
        Replay
      </Button>
    </div>
  );
}

export const DEMOS: Record<string, ComponentType> = {
  button: () => (
    <Row>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Delete</Button>
      <Button size="sm">
        <PlusIcon /> Small
      </Button>
      <Button size="icon" variant="outline" aria-label="Settings">
        <SettingsIcon />
      </Button>
      <Button disabled>Disabled</Button>
    </Row>
  ),
  toggle: () => (
    <Row>
      <Toggle aria-label="Bold">
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Italic" defaultPressed>
        <ItalicIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Favourite">
        <StarIcon /> Favourite
      </Toggle>
    </Row>
  ),
  'toggle-group': () => (
    <ToggleGroup type="single" defaultValue="month" variant="outline" aria-label="Range">
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="year">Year</ToggleGroupItem>
    </ToggleGroup>
  ),
  input: () => (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-2">
        <Label htmlFor="demo-email">Email</Label>
        <Input id="demo-email" type="email" placeholder="you@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="demo-name">Workspace name</Label>
        <Input id="demo-name" aria-invalid defaultValue="a" aria-describedby="demo-name-error" />
        <p id="demo-name-error" className="text-destructive text-sm">
          At least 3 characters.
        </p>
      </div>
      <Input disabled placeholder="Disabled" aria-label="Disabled field" />
    </div>
  ),
  textarea: () => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="demo-notes">Notes</Label>
      <Textarea id="demo-notes" placeholder="Anything the team should know" />
    </div>
  ),
  checkbox: () => (
    <div className="grid gap-3">
      {['Product updates', 'Weekly summary', 'Billing alerts'].map((l, i) => (
        <div key={l} className="flex items-center gap-2">
          <Checkbox id={`demo-cb-${i}`} defaultChecked={i !== 1} />
          <Label htmlFor={`demo-cb-${i}`}>{l}</Label>
        </div>
      ))}
    </div>
  ),
  'radio-group': () => (
    <RadioGroup defaultValue="monthly" aria-label="Billing period">
      {['monthly', 'yearly'].map((v) => (
        <div key={v} className="flex items-center gap-2">
          <RadioGroupItem value={v} id={`demo-r-${v}`} />
          <Label htmlFor={`demo-r-${v}`} className="capitalize">
            {v}
          </Label>
        </div>
      ))}
    </RadioGroup>
  ),
  switch: () => (
    <div className="flex items-center gap-3">
      <Switch id="demo-switch" defaultChecked />
      <Label htmlFor="demo-switch">Email notifications</Label>
    </div>
  ),
  select: () => (
    <div className="grid w-full max-w-xs gap-2">
      <Label htmlFor="demo-select">Role</Label>
      <Select defaultValue="editor">
        <SelectTrigger id="demo-select" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="owner">Owner</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  slider: () => <Slider defaultValue={[40]} max={100} step={1} className="max-w-sm" aria-label="Volume" />,
  'app-shell': () => (
    <div className="border-border h-80 w-full overflow-hidden rounded-xl border [&>div]:min-h-full">
      <AppShell
        brand="Northwind"
        nav={[
          { href: '/components', label: 'Overview', icon: HomeIcon },
          { href: '#customers', label: 'Customers', icon: UsersIcon },
          { href: '#billing', label: 'Billing', icon: CreditCardIcon },
        ]}
        topbar={
          <Avatar className="size-8">
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
        }>
        <PageHeader title="Overview" description="The app shell puts the sidebar here." />
      </AppShell>
    </div>
  ),
  tabs: () => (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-muted-foreground pt-2 text-sm">
        The overview panel.
      </TabsContent>
      <TabsContent value="activity" className="text-muted-foreground pt-2 text-sm">
        Recent activity.
      </TabsContent>
      <TabsContent value="settings" className="text-muted-foreground pt-2 text-sm">
        Settings.
      </TabsContent>
    </Tabs>
  ),
  breadcrumb: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Customers</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Northwind</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  command: () => (
    <Command className="border-border max-w-sm rounded-xl border">
      <CommandInput placeholder="Search or jump to…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem>
            <LayoutGridIcon /> Dashboard
          </CommandItem>
          <CommandItem>
            <UsersIcon /> Customers
          </CommandItem>
          <CommandItem>
            <FileTextIcon /> Invoices
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  'data-table': () => (
    <DataTable
      className="w-full max-w-2xl"
      caption="Invoices this month"
      rows={INVOICES}
      rowKey={(r) => r.id}
      columns={[
        { key: 'id', header: 'Invoice', sortValue: (r) => r.id },
        { key: 'customer', header: 'Customer', sortValue: (r) => r.customer },
        {
          key: 'status',
          header: 'Status',
          cell: (r) => <Badge className={STATUS_CLASS[r.status]}>{r.status}</Badge>,
        },
        { key: 'amount', header: 'Amount', align: 'right', sortValue: (r) => r.amount, cell: (r) => `£${r.amount.toLocaleString('en-GB')}` },
      ]}
    />
  ),
  table: () => (
    <Table className="max-w-md">
      <TableHeader>
        <TableRow>
          <TableHead>Plan</TableHead>
          <TableHead className="text-right">Seats</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Team</TableCell>
          <TableCell className="text-right">12</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Business</TableCell>
          <TableCell className="text-right">40</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  'stat-tile': () => (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <StatTile label="Revenue" value="£48,210" delta={12.4} deltaLabel="vs last month" />
      <StatTile label="Active customers" value="1,284" delta={3.1} deltaLabel="vs last month" />
      <StatTile label="Churn" value="2.4%" delta={-0.6} deltaLabel="vs last month" invert />
    </div>
  ),
  chart: () => (
    <ChartContainer config={chartConfig} className="h-56 w-full max-w-xl">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="visitors" fill="var(--color-visitors)" radius={6} />
      </BarChart>
    </ChartContainer>
  ),
  badge: () => (
    <Row>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge className="bg-success/15 text-success">Paid</Badge>
      <Badge className="bg-warning/15 text-warning">Pending</Badge>
    </Row>
  ),
  avatar: () => (
    <Row>
      {['AM', 'JL', 'RK'].map((i) => (
        <Avatar key={i}>
          <AvatarFallback>{i}</AvatarFallback>
        </Avatar>
      ))}
    </Row>
  ),
  separator: () => (
    <div className="max-w-sm">
      <p className="text-sm font-medium">Account</p>
      <Separator className="my-3" />
      <p className="text-muted-foreground text-sm">Profile, security, billing.</p>
    </div>
  ),
  alert: () => (
    <div className="grid w-full max-w-xl gap-3">
      <Alert>
        <ShieldCheckIcon />
        <AlertTitle>Two-step sign-in is on</AlertTitle>
        <AlertDescription>We’ll ask for a code when you sign in on a new device.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Your card was declined. Update it to keep your plan.</AlertDescription>
      </Alert>
    </div>
  ),
  toast: () => (
    <Row>
      <Button variant="outline" onClick={() => toast.success('Invoice sent')}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast('Project archived', { action: { label: 'Undo', onClick: () => toast('Restored') } })}>
        With undo
      </Button>
    </Row>
  ),
  progress: () => <Progress value={64} className="max-w-sm" aria-label="Upload progress" />,
  skeleton: () => (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  ),
  'empty-state': () => (
    <Card className="w-full max-w-xl">
      <EmptyState
        icon={InboxIcon}
        title="No invoices yet"
        description="Invoices you send appear here, with their status."
        action={
          <Button>
            <PlusIcon /> New invoice
          </Button>
        }
      />
    </Card>
  ),
  'page-header': () => (
    <PageHeader
      className="w-full"
      eyebrow="Billing"
      title="Invoices"
      description="Everything you have billed, newest first."
      actions={
        <>
          <Button variant="outline">Export</Button>
          <Button>
            <PlusIcon /> New invoice
          </Button>
        </>
      }
    />
  ),
  card: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>12 of 20 seats used</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={60} aria-label="Seats used" />
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Manage seats
        </Button>
      </CardFooter>
    </Card>
  ),
  accordion: () => (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="a">
        <AccordionTrigger>Can I change plans later?</AccordionTrigger>
        <AccordionContent>Yes, any time. We prorate the difference.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Is there a free trial?</AccordionTrigger>
        <AccordionContent>14 days on every plan, no card needed.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  collapsible: () => (
    <Collapsible className="max-w-sm">
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">
          Show advanced settings
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="text-muted-foreground pt-3 text-sm">Webhooks, API keys and audit logs.</CollapsibleContent>
    </Collapsible>
  ),
  dialog: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Rename project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>Everyone with access sees the new name.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="demo-project">Name</Label>
          <Input id="demo-project" defaultValue="Website relaunch" />
        </div>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  'alert-dialog': () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “Website relaunch”?</AlertDialogTitle>
          <AlertDialogDescription>Its 24 tasks and files go too. This can’t be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep project</AlertDialogCancel>
          <AlertDialogAction>Delete project</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  sheet: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Filters</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the invoice list.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  popover: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Share</Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-2">
        <Label htmlFor="demo-share">Invite by email</Label>
        <Input id="demo-share" placeholder="name@company.com" />
      </PopoverContent>
    </Popover>
  ),
  'dropdown-menu': () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="More actions">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Invoice</DropdownMenuLabel>
        <DropdownMenuItem>Download PDF</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Void invoice</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  tooltip: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Insights">
          <BarChart3Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Insights</TooltipContent>
    </Tooltip>
  ),
  hero: () => (
    <Hero
      className="py-6 md:py-8"
      eyebrow="New: automatic reminders"
      title="Get paid on time, without chasing."
      description="Invoices that follow up for you, in your brand, on your schedule."
      actions={
        <>
          <Button size="lg">Start free</Button>
          <Button size="lg" variant="outline">
            See how it works
          </Button>
        </>
      }
    />
  ),
  'feature-grid': () => (
    <FeatureGrid
      features={[
        { icon: ZapIcon, title: 'Sent in seconds', description: 'Turn a quote into an invoice with one click.' },
        { icon: ShieldCheckIcon, title: 'Paid safely', description: 'Cards and bank transfers, reconciled for you.' },
        { icon: SparklesIcon, title: 'Reminders that work', description: 'Polite follow-ups that stop when they pay.' },
      ]}
    />
  ),
  'pricing-card': () => (
    <div className="grid w-full gap-6 pt-3 md:grid-cols-2">
      <PricingCard name="Starter" price="£0" period="per month" features={['5 invoices a month', 'Card payments']} action={<Button variant="outline" className="w-full">Start free</Button>} />
      <PricingCard
        name="Team"
        price="£24"
        period="per month"
        highlighted
        features={['Unlimited invoices', 'Automatic reminders', '5 teammates']}
        action={<Button className="w-full">Start 14-day trial</Button>}
      />
    </div>
  ),
  'chat-message': () => (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <ChatMessage role="user" initials="AM">
        Which invoices are overdue?
      </ChatMessage>
      <ChatMessage role="assistant">
        <p>Three, totalling £4,410. Lumen Labs is the largest at £2,310.</p>
      </ChatMessage>
    </div>
  ),
  'chat-composer': ChatDemo,
  'streaming-text': StreamingDemo,
  'thinking-indicator': () => <ThinkingIndicator label="Checking your invoices" />,
  'tool-call-card': () => (
    <div className="grid w-full max-w-xl gap-3">
      <ToolCallCard title="Searched invoices" status="done" input='{ "status": "overdue" }' output="3 invoices, £4,410 total" />
      <ToolCallCard title="Drafting reminder emails" status="running" />
      <ToolCallCard title="Sent reminder to Lumen Labs" status="error" output="The contact has no email address." />
    </div>
  ),
  'approval-card': () => (
    <ApprovalCard
      className="max-w-xl"
      title="Send 3 reminder emails"
      description="Emails go out now from billing@northwind.co. You can’t unsend them."
      details={[
        { label: 'To', value: 'Lumen Labs, Acme Studio, Fernway' },
        { label: 'Total due', value: '£4,410' },
      ]}
      onApprove={() => toast.success('Reminders sent')}
      onDeny={() => toast('Nothing was sent')}
    />
  ),
};

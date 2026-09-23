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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import * as Haptics from 'expo-haptics';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function useContentInsets() {
  const insets = useSafeAreaInsets();
  return { top: insets.top, bottom: insets.bottom, left: 12, right: 12 };
}

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Text>Open dialog</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile, then save.</DialogDescription>
        </DialogHeader>
        <View className="gap-3">
          <Label htmlFor="dlg-name">Name</Label>
          <Input id="dlg-name" defaultValue="Jane Doe" />
        </View>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button>
            <Text>Save</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Text>Delete account</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone. Your account and data will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction className="bg-destructive">
            <Text className="text-destructive-foreground">Delete account</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <Text>Open popover</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="bottom">
        <View className="gap-3">
          <Text className="font-semibold">Rename list</Text>
          <Text className="text-muted-foreground text-sm">A quick edit next to the thing it changes.</Text>
          <View className="gap-2">
            <Label htmlFor="pop-name">Name</Label>
            <Input id="pop-name" defaultValue="Weekend plans" />
          </View>
          <Button size="sm">
            <Text>Save</Text>
          </Button>
        </View>
      </PopoverContent>
    </Popover>
  );
}

function DropdownMenuDemo() {
  const insets = useContentInsets();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full">
          <Text>Account menu</Text>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent insets={insets} sideOffset={4} className="w-56" align="start">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Text>Profile</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Billing</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Settings</Text>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Text>Log out</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ContextMenuDemo() {
  const insets = useContentInsets();
  return (
    <ContextMenu className="h-[120px] w-full">
      <ContextMenuTrigger
        onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        className="border-border flex h-full w-full items-center justify-center rounded-md border border-dashed">
        <Text className="text-sm">{Platform.select({ web: 'Right-click here', default: 'Long-press here' })}</Text>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52" insets={insets}>
        <ContextMenuItem>
          <Text>Copy</Text>
        </ContextMenuItem>
        <ContextMenuItem>
          <Text>Share</Text>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <Text>Delete</Text>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function HoverCardDemo() {
  const insets = useContentInsets();
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline" className="w-full">
          <Text>Show profile card</Text>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent insets={insets} className="w-80">
        <View className="flex-row gap-4">
          <Avatar alt="Expo">
            <AvatarImage source={{ uri: 'https://github.com/expo.png' }} />
            <AvatarFallback>
              <Text>E</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex-1 gap-1">
            <Text className="text-sm font-semibold">@expo</Text>
            <Text className="text-sm">Framework and tools for creating native apps with React.</Text>
          </View>
        </View>
      </HoverCardContent>
    </HoverCard>
  );
}

export const OVERLAYS_SECTIONS: ComponentSection[] = [
  {
    id: 'dialog',
    title: 'Dialog',
    category: 'overlays',
    aliases: ['modal', 'form modal'],
    api: '<Dialog><DialogTrigger asChild /><DialogContent><DialogHeader /><DialogFooter /></DialogContent></Dialog>',
    caption: 'For edits with a form. Confirmations use AlertDialog.',
    Demo: DialogDemo,
  },
  {
    id: 'alert-dialog',
    title: 'Alert dialog',
    category: 'overlays',
    aliases: ['confirm', 'destructive confirmation', 'are you sure'],
    api: '<AlertDialog>…<AlertDialogCancel /><AlertDialogAction /></AlertDialog>',
    Demo: AlertDialogDemo,
  },
  {
    id: 'popover',
    title: 'Popover',
    category: 'overlays',
    aliases: ['bubble', 'anchored'],
    api: '<Popover><PopoverTrigger asChild /><PopoverContent side /></Popover>',
    caption: 'A small anchored panel for a quick edit or extra detail next to its trigger. For a full form use Dialog; for a list of actions use DropdownMenu.',
    Demo: PopoverDemo,
  },
  {
    id: 'dropdown-menu',
    title: 'Dropdown menu',
    category: 'overlays',
    aliases: ['menu', 'actions', 'more'],
    api: '<DropdownMenu><DropdownMenuTrigger asChild /><DropdownMenuContent insets><DropdownMenuItem /></DropdownMenuContent></DropdownMenu>',
    Demo: DropdownMenuDemo,
  },
  {
    id: 'context-menu',
    title: 'Context menu',
    category: 'overlays',
    aliases: ['long press', 'right click'],
    api: '<ContextMenu><ContextMenuTrigger /><ContextMenuContent insets><ContextMenuItem /></ContextMenuContent></ContextMenu>',
    Demo: ContextMenuDemo,
  },
  {
    id: 'hover-card',
    title: 'Hover card',
    category: 'overlays',
    aliases: ['preview', 'profile card'],
    api: '<HoverCard><HoverCardTrigger asChild /><HoverCardContent insets /></HoverCard>',
    caption: 'Opens on press on native.',
    Demo: HoverCardDemo,
  },
];

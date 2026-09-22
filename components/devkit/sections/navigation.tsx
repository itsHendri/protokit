import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import type { ComponentSection } from '../types';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabsDemo() {
  const [value, setValue] = React.useState('overview');
  return (
    <View className="w-full gap-4">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList>
          <TabsTrigger value="overview">
            <Text>Overview</Text>
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Text>Activity</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Summary content for the first tab.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">
                <Text>Do something</Text>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>A list of recent events would go here.</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </View>
  );
}

function MenubarDemo() {
  const insets = useSafeAreaInsets();
  const contentInsets = { top: insets.top, bottom: insets.bottom, left: 12, right: 12 };
  const [value, setValue] = React.useState<string | undefined>();
  const [bookmarks, setBookmarks] = React.useState(true);
  return (
    <Menubar value={value} onValueChange={setValue}>
      <MenubarMenu value="file">
        <MenubarTrigger>
          <Text>File</Text>
        </MenubarTrigger>
        <MenubarContent insets={contentInsets}>
          <MenubarItem>
            <Text>New</Text>
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            <Text>Open recent</Text>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Text>Print…</Text>
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>
          <Text>View</Text>
        </MenubarTrigger>
        <MenubarContent insets={contentInsets}>
          <MenubarCheckboxItem checked={bookmarks} onCheckedChange={setBookmarks} closeOnPress={false}>
            <Text>Show bookmarks</Text>
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Reload</Text>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export const NAVIGATION_SECTIONS: ComponentSection[] = [
  {
    id: 'tabs',
    title: 'Tabs',
    category: 'navigation',
    aliases: ['segmented', 'tab bar', 'content switch'],
    api: '<Tabs value onValueChange><TabsList><TabsTrigger value /></TabsList><TabsContent value /></Tabs>',
    caption: 'In-page content switching. App-level tabs are the Expo Router tab bar.',
    Demo: TabsDemo,
  },
  {
    id: 'menubar',
    title: 'Menubar',
    category: 'navigation',
    aliases: ['menu', 'toolbar', 'desktop'],
    api: '<Menubar value onValueChange><MenubarMenu value><MenubarTrigger /><MenubarContent /></MenubarMenu></Menubar>',
    caption: 'Mostly a web/desktop pattern; prefer a DropdownMenu on phones.',
    Demo: MenubarDemo,
  },
];

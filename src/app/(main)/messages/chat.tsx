"use client";

import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Chat as StreamChat } from 'stream-chat-react';

import ChatChannel from './chat-channel';
import ChatSidebar from './chat-sidebar';
import useIntialiseChatClient from './use-initialise-chat-client';

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const chatClient = useIntialiseChatClient();

  const { resolvedTheme } = useTheme();

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-md">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-char__theme-light"
          }
        >
          <ChatSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannel
            open={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
}

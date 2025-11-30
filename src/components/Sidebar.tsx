import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import type { LogEntry } from '../lib/logs';

interface SidebarProps {
  logs: LogEntry[];
  currentSessionId?: string;
  basePath?: string;
}

export function Sidebar({ logs, currentSessionId, basePath }: SidebarProps) {
  const [query, setQuery] = useState('');
  
  // Get base path from prop or detect from current location
  const getBasePath = () => {
    if (basePath) return basePath;
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      return pathSegments.length > 0 ? `/${pathSegments[0]}` : '';
    }
    return '/texts-with-the-machine';
  };
  
  const base = getBasePath();

  const fuse = useMemo(() => {
    return new Fuse(logs, {
      keys: ['agentName', 'previewText', 'messages.content', 'modelName', 'personality'],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [logs]);

  const filteredLogs = useMemo(() => {
    if (!query) return logs;
    return fuse.search(query).map((result) => result.item);
  }, [query, logs, fuse]);

  return (
    <aside className="session-picker w-80 h-full border-r bg-muted/10 flex flex-col">
      <div className="session-search p-4 border-b space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Chat Sessions</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search sessions..."
            className="w-full rounded-md border bg-background py-2 pl-8 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {filteredLogs.length === 0 ? (
           <div className="p-4 text-center text-sm text-muted-foreground">
             No sessions found.
           </div>
        ) : (
            <div className="space-y-1">
            {filteredLogs.map((log) => {
                const isActive = log.id === currentSessionId;
                const previewText = log.previewText || log.messages[log.messages.length - 1]?.content || 'No messages';
                const date = format(new Date(log.timestamp), 'MMM d, yyyy h:mm a');

                return (
                <a
                    key={log.id}
                    href={`${base}/session/${log.id}`}
                    className={`block p-3 rounded-lg transition-colors text-left ${
                    isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                >
                    <div className="flex items-start justify-between gap-2">
                        <span className="font-medium truncate">{log.agentName}</span>
                        <span suppressHydrationWarning className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{format(new Date(log.timestamp), 'MM/dd')}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2 break-words">
                        {previewText}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary/80 truncate max-w-[100px]">
                            {log.modelName}
                        </div>
                    </div>
                </a>
                );
            })}
            </div>
        )}
      </div>
    </aside>
  );
}


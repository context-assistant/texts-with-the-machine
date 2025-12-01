import React, { useState } from 'react';
import { Bot, User, Calendar, Cpu, Sparkles, MessageSquareQuote, Menu, X, Home } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { LogEntry } from '../lib/logs';
import type { AgentProfile } from '../lib/agents';
import { ThemeToggle } from './ThemeToggle';
import { Sidebar } from './Sidebar';

interface ChatViewProps {
  log: LogEntry;
  allLogs?: LogEntry[];
  agents?: AgentProfile[];
  basePath?: string;
}

export function ChatView({ log, allLogs = [], agents = [], basePath }: ChatViewProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const agent = agents.find(a => a.name === log.agentName);
  const agentImage = agent?.image ? `${base}/${agent.image}` : null;

  return (
    <div className="chat-view h-full w-full flex flex-col bg-background relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute inset-0 z-50 bg-background md:hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold">Sessions</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                    <X className="h-5 w-5" />
                </button>
            </div>
            <div className="flex-1 overflow-hidden">
                <Sidebar logs={allLogs} currentSessionId={log.id} basePath={basePath} />
            </div>
        </div>
      )}

      {/* Header / Agent Card */}
      <header className="agent-card-header border-b p-4 md:p-6 bg-card/50 backdrop-blur-sm flex items-start justify-between sticky top-0 z-10">
        <div className="flex items-start gap-3 md:gap-4">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden mt-2 p-2 -ml-2 hover:bg-accent rounded-md"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
            {agentImage ? (
               <img 
                 src={agentImage} 
                 alt={log.agentName} 
                 className="h-full w-full object-cover"
               />
            ) : (
               <Bot className="h-6 w-6 md:h-7 md:w-7" />
            )}
          </div>
          <div className="space-y-1 min-w-0">
            <h1 className="text-lg md:text-2xl font-bold tracking-tight truncate">{log.agentName}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Cpu className="h-3 w-3" />
                    <span>{log.modelName}</span>
                </div>
                <div className="flex items-center gap-1 hidden sm:flex">
                    <Calendar className="h-3 w-3" />
                    <span suppressHydrationWarning>{format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}</span>
                </div>
            </div>
            {agent?.description && (
                <p className="text-base text-muted-foreground/80 mt-2 line-clamp-2 max-w-xl">
                    {agent.description}
                </p>
            )}
            {(log.personality || log.communicationStyle) && (
                <div className="flex flex-wrap gap-2 mt-2 hidden sm:flex">
                    {log.personality && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
                            <Sparkles className="h-3 w-3" />
                            {log.personality}
                        </span>
                    )}
                    {log.communicationStyle && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                            <MessageSquareQuote className="h-3 w-3" />
                            {log.communicationStyle}
                        </span>
                    )}
                </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
             <a 
               href={base || '/'} 
               className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
               aria-label="Back to Home"
             >
               <Home className="h-5 w-5" />
             </a>
             <ThemeToggle />
        </div>
      </header>

      {/* Messages */}
      <div className="chat-messages-container w-full flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="chat-messages-list w-full max-w-[800px] mx-auto space-y-6">
        {log.messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`chat-bubble-row flex gap-3 md:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1 overflow-hidden">
                  {agentImage ? (
                    <img 
                      src={agentImage} 
                      alt={log.agentName} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
              )}
              
              <div
                className={`chat-bubble-content markdown-content max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-2 md:px-5 md:py-3 text-base leading-relaxed ${
                  isUser
                    ? 'chat-bubble-user bg-primary text-primary-foreground rounded-tr-sm'
                    : 'chat-bubble-ai bg-muted text-foreground rounded-tl-sm'
                }`}
              >
                {msg.src ? (
                  <img 
                    src={msg.src.startsWith('./') ? `${base}/${msg.src.substring(2)}` : msg.src}
                    alt="User uploaded"
                    className="max-w-full rounded-lg"
                  />
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                )}
              </div>

              {isUser && (
                 <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground shrink-0 mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
        
        {/* Spacer at bottom */}
        <div className="h-10" />
        </div>
      </div>
    </div>
  );
}

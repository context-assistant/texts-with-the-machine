import React, { useState } from 'react';
import { Bot, ArrowRight, Quote, RefreshCw } from 'lucide-react';
import type { LogEntry } from '../lib/logs';
import type { AgentProfile } from '../lib/agents';
import type { AgentQuote } from '../lib/quotes';

interface HeroSectionProps {
  logs: LogEntry[];
  agents: AgentProfile[];
  quotes?: AgentQuote[];
  featuredQuote?: AgentQuote;
  basePath?: string;
}

export function HeroSection({ logs, agents, quotes = [], featuredQuote, basePath }: HeroSectionProps) {
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
  const [currentQuote, setCurrentQuote] = useState<AgentQuote | undefined>(featuredQuote);

  const handleNewQuote = () => {
    if (quotes.length === 0) return;

    // Get all unique agents
    const uniqueAgents = Array.from(new Set(quotes.map(q => q.agentName))).sort();
    
    if (uniqueAgents.length > 1 && currentQuote) {
      // Find current agent index
      const currentAgentIndex = uniqueAgents.indexOf(currentQuote.agentName);
      
      // Calculate next agent index (cycle)
      const nextAgentIndex = (currentAgentIndex + 1) % uniqueAgents.length;
      const nextAgent = uniqueAgents[nextAgentIndex];
      
      // Filter quotes for the next agent
      const nextAgentQuotes = quotes.filter(q => q.agentName === nextAgent);
      
      // Pick a random quote from the next agent
      if (nextAgentQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * nextAgentQuotes.length);
        setCurrentQuote(nextAgentQuotes[randomIndex]);
        return;
      }
    }

    // Fallback to simple random selection (or if only one agent)
    let nextQuote = currentQuote;
    // Try to get a different quote if possible
    let attempts = 0;
    while (nextQuote === currentQuote && attempts < 5) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        nextQuote = quotes[randomIndex];
        attempts++;
    }
    setCurrentQuote(nextQuote);
  };
  
  return (
    <div className="landing-hero min-h-full flex flex-col items-center justify-center p-8 md:p-12">
      <div className="max-w-6xl w-full space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Bot className="h-10 w-10" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Texts with the Machine
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            A collection of conversations with the AI personalities I'm crafting. Explore chat logs, discover unique agent personalities, and dive into meaningful dialogues colored by system prompts.
          </p>
        </div>

        {/* Agent Personality Cards */}
        {agents.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Meet the Personalities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent, index) => (
                <div key={index} className="p-6 rounded-lg border bg-card hover:bg-card/80 transition-colors space-y-4 min-w-[280px]">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img 
                        src={`${base}/${agent.image}`}
                        alt={agent.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold">{agent.name}</h3>
                      <p className="text-sm text-primary font-medium mt-1">{agent.personality}</p>
                    </div>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {agent.description}
                  </p>
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Model:</span> {agent.modelName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Random Quote */}
        {currentQuote && (
          <div className="mt-12 flex justify-center">
            <a 
              href={`${base}/session/${currentQuote.sessionId}`}
              className="group relative max-w-2xl w-full p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg text-center"
            >
              <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/20 rotate-180" />
              <Quote className="absolute bottom-4 right-4 h-8 w-8 text-primary/20" />
              
              <blockquote className="relative z-10">
                <p className="text-xl md:text-2xl font-medium text-foreground italic mb-4 leading-relaxed whitespace-pre-wrap">
                  "{currentQuote.quote}"
                </p>
                <cite className="text-base text-muted-foreground not-italic flex items-center justify-center gap-2 group-hover:text-primary transition-colors">
                  — {currentQuote.agentName}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </cite>
              </blockquote>
            </a>
          </div>
        )}


        {/* CTA */}
        <div className="text-center pt-8 flex flex-wrap items-center justify-center gap-4">
          {logs.length > 0 && (
            <a 
              href={`${base}/session/${logs[0].id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              View Latest Session
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
          
          {quotes.length > 1 && (
             <button
                onClick={handleNewQuote}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium transition-colors"
             >
                <RefreshCw className="h-4 w-4" />
                Another Quote
             </button>
          )}
        </div>

        {logs.length === 0 && (
          <div className="text-center p-6 rounded-lg border bg-muted/50">
            <p className="text-muted-foreground">
              No chat logs found. Add JSON log files to the <code className="px-2 py-1 rounded bg-background text-foreground">logs/</code> directory to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


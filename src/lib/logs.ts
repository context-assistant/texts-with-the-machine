import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = path.join(process.cwd(), 'logs');

export interface ChatMessage {
  role: 'user' | 'assistant';
  content?: string;
  agentName?: string;
  src?: string;
}

export interface LogEntry {
  id: string;
  requestId: string;
  timestamp: number;
  modelName: string;
  agentName?: string;
  personality?: string;
  communicationStyle?: string;
  previewText?: string;
  messages: ChatMessage[];
}

function parseSystemPrompt(prompt: string) {
  const info: { agentName?: string; personality?: string; communicationStyle?: string } = {};

  // Simple extraction based on the provided format
  // Looking for "Role: ... named X" or similar patterns if strictly structured,
  // but since it's "Agent Name, Personality, and Communication (style)", I'll try to be flexible.

  // Example: "Role: ... named Gemma..."
  const nameMatch = prompt.match(/named\s+([^\s,.]+)/i);
  if (nameMatch) {
    info.agentName = nameMatch[1];
  }

  // Example: "Personality:\n- whimsical"
  const personalityMatch = prompt.match(/Personality:\s*(?:- )?([^\n]+)/i);
  if (personalityMatch) {
      info.personality = personalityMatch[1].trim();
  }

   // Example: "Communication:\n- ..." (Assuming a similar format if present)
   const communicationMatch = prompt.match(/Communication:\s*(?:- )?([^\n]+)/i);
   if (communicationMatch) {
       info.communicationStyle = communicationMatch[1].trim();
   }

  return info;
}

export async function getAllLogs(): Promise<LogEntry[]> {
  if (!fs.existsSync(LOGS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(LOGS_DIR).filter(file => file.endsWith('.json'));
  
  const logs: LogEntry[] = files.map(file => {
    const filePath = path.join(LOGS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const raw = JSON.parse(content);
    
    // Extract main entry
    const entry = raw.entry;
    const systemPrompt = entry.systemPrompt || "";
    const promptInfo = parseSystemPrompt(systemPrompt);

    // Priority 1: Explicit agentName in entry.metadata or entry
    let derivedAgentName = entry.metadata?.agentName || entry.agentName;
    
    // Priority 2: Check first assistant message
    if (!derivedAgentName && entry.metadata?.messages) {
        const firstAssistant = entry.metadata.messages.find((m: any) => m.role === 'assistant');
        if (firstAssistant?.agentName) {
            derivedAgentName = firstAssistant.agentName;
        }
    }
    
    // Priority 3: Parse from system prompt (fallback)
    if (!derivedAgentName) {
        derivedAgentName = promptInfo.agentName;
    }

    // Get preview text - explicit first, then fallback to last message
    let previewText = entry.metadata?.previewText || entry.previewText;
    if (!previewText && entry.metadata?.messages?.length > 0) {
        const lastMessage = entry.metadata.messages[entry.metadata.messages.length - 1];
        previewText = lastMessage?.content || 'No messages';
        // Truncate if too long
        if (previewText.length > 150) {
            previewText = previewText.substring(0, 147) + '...';
        }
    }

    return {
      id: entry.id, // Session ID
      requestId: raw.requestId,
      timestamp: raw.timestamp,
      modelName: entry.modelName,
      agentName: derivedAgentName || 'Unknown Agent',
      personality: entry.metadata?.personality || entry.personality || promptInfo.personality,
      communicationStyle: entry.metadata?.communicationStyle || entry.communicationStyle || promptInfo.communicationStyle,
      previewText: previewText,
      messages: entry.metadata?.messages || []
    };
  });

  // Sort by timestamp descending
  return logs.sort((a, b) => b.timestamp - a.timestamp);
}

export async function getLogById(id: string): Promise<LogEntry | undefined> {
    const logs = await getAllLogs();
    return logs.find(log => log.id === id);
}



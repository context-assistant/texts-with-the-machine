import fs from 'fs';
import path from 'path';

const QUOTES_DIR = path.join(process.cwd(), 'src', 'quotes');

export interface AgentQuote {
  quote: string;
  sessionId: string;
  agentName: string; // Derived from filename
}

export async function getAllQuotes(): Promise<AgentQuote[]> {
  if (!fs.existsSync(QUOTES_DIR)) {
    return [];
  }

  const files = fs.readdirSync(QUOTES_DIR).filter(file => file.endsWith('.json'));
  
  const allQuotes: AgentQuote[] = [];

  for (const file of files) {
    const filePath = path.join(QUOTES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    try {
        const quotes = JSON.parse(content);
        // Capitalize filename for a rough agent name fallback if needed, 
        // though we might want to join with agent profiles later for the real name.
        const agentName = file.replace('.json', ''); 
        
        if (Array.isArray(quotes)) {
            quotes.forEach(q => {
                if (q.quote && q.sessionId) {
                    allQuotes.push({
                        quote: q.quote,
                        sessionId: q.sessionId,
                        agentName: agentName.charAt(0).toUpperCase() + agentName.slice(1) // Simple capitalization
                    });
                }
            });
        }
    } catch (error) {
        console.error(`Error parsing quotes file ${file}:`, error);
    }
  }

  return allQuotes;
}


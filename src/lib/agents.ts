import fs from 'fs';
import path from 'path';

const AGENTS_DIR = path.join(process.cwd(), 'src', 'agents');

export interface AgentProfile {
  name: string;
  personality: string;
  modelName: string;
  description: string;
  image: string;
}

export async function getAllAgents(): Promise<AgentProfile[]> {
  if (!fs.existsSync(AGENTS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(AGENTS_DIR).filter(file => file.endsWith('.json'));
  
  const agents: AgentProfile[] = files.map(file => {
    const filePath = path.join(AGENTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as AgentProfile;
  });

  return agents;
}


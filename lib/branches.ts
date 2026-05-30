import { promises as fs } from 'fs';
import path from 'path';

export interface Branch {
  id: string;
  name: string;
  address: string;
  area: string;
  photo?: string;
}

let BRANCHES: Branch[] = [];

export async function loadBranches() {
  if (BRANCHES.length === 0) {
    try {
      const filePath = path.join(process.cwd(), 'config', 'branches.json');
      const fileContents = await fs.readFile(filePath, 'utf8');
      BRANCHES = JSON.parse(fileContents);
    } catch (error) {
      console.error('Failed to load branches from config/branches.json:', error);
      // Fallback or throw error depending on desired behavior
      BRANCHES = []; // Ensure it's an empty array on error
    }
  }
  return BRANCHES;
}

export async function getBranchById(id: string): Promise<Branch | undefined> {
  await loadBranches();
  return BRANCHES.find(branch => branch.id === id);
}

// Export BRANCHES as a promise or a function that returns a promise
export const getBranches = async (): Promise<Branch[]> => {
  await loadBranches();
  return BRANCHES;
};

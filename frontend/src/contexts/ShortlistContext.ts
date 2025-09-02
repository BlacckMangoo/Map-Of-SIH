import { createContext } from 'react';

// Define the problem statement type
export interface ProblemStatement {
  Statement_id: string;
  Title: string;
  Category: string;
  Technology_Bucket: string;
  Description: string;
  DepartmentOrg: string;
  Generated_Tags?: string[];
}

// Define the context type
export interface ShortlistContextType {
  shortlistedItems: ProblemStatement[];
  addToShortlist: (item: ProblemStatement) => void;
  removeFromShortlist: (id: string) => void;
  isShortlisted: (id: string) => boolean;
  clearShortlist: () => void;
}

// Create the context with a default value
export const ShortlistContext = createContext<ShortlistContextType | undefined>(undefined);

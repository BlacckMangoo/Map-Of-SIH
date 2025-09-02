import { useContext } from 'react';
import { ShortlistContext } from './ShortlistContext';

// Custom hook to use the shortlist context
export function useShortlist() {
  const context = useContext(ShortlistContext);
  if (context === undefined) {
    throw new Error('useShortlist must be used within a ShortlistProvider');
  }
  return context;
}

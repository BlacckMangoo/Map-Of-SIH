import React, { useState, useEffect } from 'react';
import { ShortlistContext } from './ShortlistContext';
import type { ProblemStatement } from './ShortlistContext';

export interface ShortlistProviderProps {
  children: React.ReactNode;
}

export const ShortlistProvider: React.FC<ShortlistProviderProps> = ({ children }) => {
  // Initialize shortlist state from localStorage or empty array
  const [shortlistedItems, setShortlistedItems] = useState<ProblemStatement[]>(() => {
    const savedItems = localStorage.getItem('shortlistedItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // Save to localStorage whenever shortlist changes
  useEffect(() => {
    localStorage.setItem('shortlistedItems', JSON.stringify(shortlistedItems));
  }, [shortlistedItems]);

  // Add an item to the shortlist
  const addToShortlist = (item: ProblemStatement) => {
    setShortlistedItems((prevItems) => {
      // Check if item already exists in the shortlist
      if (prevItems.some((existingItem) => existingItem.Statement_id === item.Statement_id)) {
        return prevItems; // Don't add duplicates
      }
      return [...prevItems, item];
    });
  };

  // Remove an item from the shortlist
  const removeFromShortlist = (id: string) => {
    setShortlistedItems((prevItems) => 
      prevItems.filter((item) => item.Statement_id !== id)
    );
  };

  // Check if an item is already shortlisted
  const isShortlisted = (id: string) => {
    return shortlistedItems.some((item) => item.Statement_id === id);
  };

  // Clear the entire shortlist
  const clearShortlist = () => {
    setShortlistedItems([]);
  };

  return (
    <ShortlistContext.Provider 
      value={{ 
        shortlistedItems, 
        addToShortlist, 
        removeFromShortlist, 
        isShortlisted,
        clearShortlist 
      }}
    >
      {children}
    </ShortlistContext.Provider>
  );
};

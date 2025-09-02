import { useState } from 'react';
import { useShortlist } from '@/contexts/useShortlist';
import { Badge } from '@/components/ui/badge';
import type { ProblemStatement } from '@/contexts/ShortlistContext';

// Define an interface for communication with parent component
type SidebarControlProps = {
  openSidebar?: (statementId: string) => void;
};

export function MyShortlists({ openSidebar }: SidebarControlProps) {
  const { shortlistedItems, removeFromShortlist } = useShortlist();
  const [isExpanded, setIsExpanded] = useState(false);

  if (shortlistedItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-30">
      {/* Collapsed state - just show badge count */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text py-2 px-4 rounded-lg shadow-md transition-all duration-200 border border-ctp-overlay0"
        >
          <span className="font-medium">My Shortlist</span>
          <Badge className="bg-ctp-mauve text-ctp-base">
            {shortlistedItems.length}
          </Badge>
        </button>
      ) : (
        // Expanded state - show list of shortlisted items
        <div className="bg-ctp-mantle/90 backdrop-blur-sm border border-ctp-surface0 rounded-lg shadow-lg overflow-hidden max-w-sm w-72 transition-all duration-200">
          <div className="flex items-center justify-between p-3 bg-ctp-surface0/60 border-b border-ctp-surface0">
            <h3 className="font-semibold text-ctp-text">My Shortlist</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsExpanded(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-ctp-surface1 hover:bg-ctp-surface2 text-ctp-subtext0 text-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {shortlistedItems.length === 0 ? (
              <p className="text-ctp-subtext0 p-4 text-center">Your shortlist is empty</p>
            ) : (
              <ul className="divide-y divide-ctp-surface0">
                {shortlistedItems.map((item: ProblemStatement) => (
                  <li key={item.Statement_id} className="p-2 hover:bg-ctp-surface0/50 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <div 
                        className="flex-grow cursor-pointer hover:bg-ctp-surface1/50 p-1 rounded-md transition-colors"
                        onClick={() => openSidebar && openSidebar(item.Statement_id)}
                      >
                        <p className="text-sm font-medium text-ctp-text line-clamp-1">{item.Title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-xs border-ctp-yellow text-ctp-yellow">
                            {item.Technology_Bucket}
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-ctp-sapphire text-ctp-base">
                            {item.Statement_id}
                          </Badge>
                        </div>
                        <p className="text-xs text-ctp-sapphire mt-1 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path>
                          </svg>
                          Click to view in sidebar
                        </p>
                      </div>
                      <button 
                        onClick={() => removeFromShortlist(item.Statement_id)}
                        className="text-ctp-red hover:text-ctp-maroon p-1 rounded-full hover:bg-ctp-surface0 self-start"
                        title="Remove from shortlist"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

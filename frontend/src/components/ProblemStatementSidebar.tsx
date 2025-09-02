import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useShortlist } from "@/contexts/useShortlist";

interface ProblemStatement {
  Statement_id: string;
  Title: string;
  Category: string;
  Technology_Bucket: string;
  Description: string;
  DepartmentOrg: string;
  Generated_Tags?: string[];
}

interface ProblemStatementSidebarProps {
  data: ProblemStatement | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProblemStatementSidebar({ data, isOpen, onClose }: ProblemStatementSidebarProps) {
  const { addToShortlist, removeFromShortlist, isShortlisted } = useShortlist();
  
  if (!data) return null;
  
  const isItemShortlisted = isShortlisted(data.Statement_id);
  
  const handleClose = () => {
    console.log('Close button clicked');
    onClose();
  };
  
  const handleShortlistToggle = () => {
    if (isItemShortlisted) {
      removeFromShortlist(data.Statement_id);
    } else {
      addToShortlist(data);
    }
  };

  return (
    <>
      {/* Subtle overlay just for edge area to help with visual separation and click detection */}
      {isOpen && (
        <div 
          className="fixed inset-0 pointer-events-none z-40"
          onClick={handleClose}
        >
          {/* Only add click event handling to a narrow strip at the left edge of the overlay */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-ctp-crust/10 to-transparent pointer-events-auto" 
            onClick={handleClose}
          />
        </div>
      )}
      
      <div 
        className={`fixed top-0 right-0 h-full transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Sidebar content */}
        <div className="relative w-full sm:w-96 md:w-[420px] lg:w-[480px] h-full bg-ctp-mantle/90 backdrop-blur-md border-l border-ctp-surface0 shadow-lg flex flex-col">
          {/* Header with action buttons */}
          <div className="flex justify-between items-center p-4 border-b border-ctp-surface0">
            {/* Shortlist Button */}
            <button 
              type="button"
              onClick={handleShortlistToggle}
              aria-label={isItemShortlisted ? "Remove from shortlist" : "Add to shortlist"}
              className={`
                w-10 h-10 rounded flex items-center justify-center 
                transition-colors duration-200 z-50 cursor-pointer
                ${isItemShortlisted 
                  ? 'bg-ctp-pink/20 text-ctp-pink hover:bg-ctp-pink/30' 
                  : 'bg-ctp-surface0 text-ctp-subtext0 hover:bg-ctp-surface1 hover:text-ctp-text'}
              `}
            >
              {isItemShortlisted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              )}
            </button>
            
            {/* Close Button */}
            <button 
              type="button"
              onClick={handleClose}
              aria-label="Close sidebar"
              className="w-10 h-10 rounded flex items-center justify-center 
                      bg-ctp-surface0 hover:bg-ctp-red hover:text-ctp-base text-ctp-subtext0 
                      transition-colors duration-200 z-50 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-6">
              {/* Statement ID & Category */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-ctp-blue text-ctp-base">
                  {data.Statement_id}
                </Badge>
                <Badge variant="outline" className="border-ctp-green text-ctp-green">
                  {data.Category}
                </Badge>
                <Badge variant="outline" className="border-ctp-yellow text-ctp-yellow">
                  {data.Technology_Bucket}
                </Badge>
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-semibold text-ctp-text leading-tight">
                {data.Title}
              </h2>
              
              {/* Department/Organization */}
              <div className="pb-2 border-b border-ctp-surface0">
                <p className="text-sm text-ctp-subtext0">Organization:</p>
                <p className="text-ctp-text">{data.DepartmentOrg}</p>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-ctp-lavender">Description</h3>
                <div className="text-ctp-text text-sm leading-relaxed whitespace-pre-wrap">
                  {data.Description}
                </div>
              </div>
              
              {/* Tags */}
              {data.Generated_Tags && data.Generated_Tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-ctp-lavender">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.Generated_Tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-ctp-surface1 text-ctp-text hover:bg-ctp-surface2"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

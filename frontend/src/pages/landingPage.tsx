import { Link } from 'react-router';
import '../index.css';
import handPointingImg from '../assets/LandingPageAssets/handPointingUser.png';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data for demonstration
const dummyProblemStatements = [
  {
    Statement_id: "SIH1234",
    Title: "Automated Pothole Detection System",
    Category: "Smart Cities",
    Technology_Bucket: "AI/ML",
    Description: "Develop a system that can automatically detect and report potholes on roads using smartphone cameras and machine learning algorithms. The solution should be able to assess the severity of damage and prioritize repairs.",
    DepartmentOrg: "Ministry of Road Transport & Highways",
    Generated_Tags: ["Computer Vision", "Urban Planning", "IoT", "Public Infrastructure", "Smart Cities"]
  },
  {
    Statement_id: "SIH5678",
    Title: "Student Mental Health Monitoring Dashboard",
    Category: "Healthcare",
    Technology_Bucket: "Data Analytics",
    Description: "Create a dashboard for educational institutions to anonymously monitor and analyze student mental health trends. The system should help identify stress patterns and provide early intervention opportunities.",
    DepartmentOrg: "Ministry of Education",
    Generated_Tags: ["Mental Health", "Education", "Dashboard", "Analytics", "Wellness"]
  },
  {
    Statement_id: "SIH9012",
    Title: "Blockchain-based Supply Chain Verification",
    Category: "Finance",
    Technology_Bucket: "Blockchain",
    Description: "Implement a blockchain solution to verify the authenticity of products through the supply chain. The solution should prevent counterfeiting and provide end-to-end transparency for consumers.",
    DepartmentOrg: "Ministry of Commerce & Industry",
    Generated_Tags: ["Blockchain", "Supply Chain", "Verification", "Transparency", "Traceability"]
  }
];

// Demo Hover Card Component
function DemoHoverCard() {
  const [hoveredNode, setHoveredNode] = useState<null | number>(null);
  
  const handleNodeHover = (index: number) => {
    setHoveredNode(index);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* H2: Feature title with consistent bold styling */}
      <h2 className="text-xl font-bold text-ctp-text mb-4">Hover to Explore PS</h2>
      
      {/* Simulated graph nodes */}
      <div className="w-64 h-48 relative flex items-center justify-center bg-ctp-surface0 rounded-lg p-4 mb-2">
        <div className="absolute text-xs text-ctp-subtext1 top-2 left-2">Hover & click nodes for details</div>
        
        {/* Node circles */}
        {[0, 1, 2].map((index) => (
          <div 
            key={index}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center m-2 cursor-pointer transition-all duration-300 relative ${
              hoveredNode === index 
                ? 'bg-ctp-sapphire text-ctp-base scale-110 z-10 shadow-lg ring-4 ring-ctp-sapphire/40 ring-offset-2 ring-offset-ctp-surface0' 
                : 'bg-ctp-surface1 text-ctp-text hover:bg-ctp-surface2 hover:ring-2 hover:ring-ctp-sapphire/30'
            }`}
            onMouseEnter={() => handleNodeHover(index)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <span>PS{index + 1}</span>
            {hoveredNode === index && (
              <span className="text-[8px] mt-0.5 animate-pulse font-bold">Click me</span>
            )}
            
            {/* The hover card - positioned relative to each node */}
            {hoveredNode === index && (
              <div className="absolute z-40 w-64 top-16 left-1/2 transform -translate-x-1/2">
                <Card className="bg-ctp-surface0 border-ctp-overlay0 shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-ctp-text text-sm font-semibold leading-tight line-clamp-2">
                        {dummyProblemStatements[index].Title}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-ctp-sapphire text-ctp-base text-xs shrink-0">
                        {dummyProblemStatements[index].Statement_id}
                      </Badge>
                    </div>
                    <CardDescription className="text-ctp-subtext1 text-xs">
                      {dummyProblemStatements[index].DepartmentOrg}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-xs space-y-2 pb-3">
                    <p className="text-ctp-text line-clamp-2">
                      {dummyProblemStatements[index].Description}
                    </p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="border-ctp-green text-ctp-green text-xs">
                        {dummyProblemStatements[index].Category}
                      </Badge>
                      <Badge variant="outline" className="border-ctp-yellow text-ctp-yellow text-xs">
                        {dummyProblemStatements[index].Technology_Bucket}
                      </Badge>
                    </div>
                    
                    <div className="pt-1 flex items-center justify-center">
                      <button className="py-1 px-3 bg-ctp-sapphire text-ctp-base text-xs rounded-full flex items-center gap-1 hover:bg-ctp-sapphire/90 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path>
                        </svg>
                        View in sidebar
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Demo Shortlist Component
function DemoShortlist() {
  // Remove unused state
  const [shortlist, setShortlist] = useState([dummyProblemStatements[0], dummyProblemStatements[2]]);
  
  const removeItem = (id: string) => {
    setShortlist(shortlist.filter(item => item.Statement_id !== id));
  };
  
  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* H2: Feature title with consistent bold styling */}
      <h2 className="text-xl font-bold text-ctp-text mb-4">Bookmark & Shortlist</h2>
      
      <div className="bg-ctp-mantle border border-ctp-surface0 rounded-lg shadow-lg overflow-hidden w-64">
        <div className="flex items-center justify-between p-2 bg-ctp-surface0 border-b border-ctp-surface0">
          <h3 className="font-medium text-ctp-text text-sm">My Shortlist</h3>
          <Badge className="bg-ctp-sapphire text-ctp-base text-xs">
            {shortlist.length}
          </Badge>
        </div>

        <div className="h-48 overflow-y-auto">
          {shortlist.length === 0 ? (
            <p className="text-ctp-subtext0 p-4 text-center text-sm">Your shortlist is empty</p>
          ) : (
            <ul className="divide-y divide-ctp-surface0">
              {shortlist.map((item) => (
                <li key={item.Statement_id} className="p-2 hover:bg-ctp-surface0/50 transition-colors">
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <p className="text-xs font-medium text-ctp-text line-clamp-1">{item.Title}</p>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-[10px] border-ctp-yellow text-ctp-yellow">
                          {item.Technology_Bucket}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] bg-ctp-sapphire text-ctp-base">
                          {item.Statement_id}
                        </Badge>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.Statement_id)}
                      className="text-ctp-red hover:text-ctp-maroon p-1 rounded-full hover:bg-ctp-surface0"
                      title="Remove from shortlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        
        <div className="p-2 border-t border-ctp-surface0 bg-ctp-surface0/40">
          <button className="w-full py-1 px-2 text-xs bg-ctp-sapphire text-ctp-base rounded hover:bg-ctp-sapphire/90 transition-colors">
            Export Shortlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
    return (
        <div className="h-screen overflow-hidden bg-ctp-base text-ctp-text flex flex-col items-center justify-center p-4 md:p-8">
            <div className="max-w-6xl w-full mx-auto flex flex-col h-full justify-between py-4">
                {/* Main content section - more compact */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 pt-2">
                    {/* Image column - smaller image */}
                    <div className="md:w-2/5 flex justify-center md:justify-end">
                        <img 
                            src={handPointingImg} 
                            alt="Hand pointing at you" 
                            className="max-w-full w-auto h-auto md:max-h-80 object-contain"
                        />
                    </div>
                    
                    <div className="md:w-3/5">
                        <div className="p-2 relative space-y-2">
                            {/* H1: Hero headline with accent color */}
                            <h1 className="text-3xl md:text-4xl font-extrabold text-ctp-sapphire tracking-tight">
                                Are you still using that confusing SIH website?
                            </h1>
                            
                            {/* H2: Feature title with consistent bold styling */}
                            <h2 className="text-xl md:text-2xl font-bold text-ctp-text leading-snug mt-4">
                                Find the perfect problem statement with ease
                            </h2>
                         
                        </div>
                    </div>
                </div>
                
                {/* Clear CTA section - more compact */}
                <div className="text-center my-2 flex justify-center gap-4">
                    <Link to="/app" 
                        className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-lg font-bold transition-all
                            bg-ctp-sapphire hover:bg-ctp-sapphire/90 text-ctp-base shadow-md hover:shadow-xl hover:-translate-y-1 duration-300">
                        Click to Launch
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                    
                    <a href="https://github.com/BlacckMangoo/Map-Of-SIH" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-lg font-bold transition-all
                           bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text shadow-md hover:shadow-xl hover:-translate-y-1 duration-300 border border-ctp-overlay0">
                        Star on GitHub
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"></path>
                        </svg>
                    </a>
                </div>
                
                {/* Feature section - interactive components */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-20 flex-1 mt-0 md:mt-2">
                    {/* Feature 1: Hover to Explore - Interactive Demo */}
                    <div className="flex flex-col items-center">
                        <DemoHoverCard />
                    </div>
                    
                    {/* Feature 2: Bookmarks - Interactive Demo */}
                    <div className="flex flex-col items-center">
                        <DemoShortlist />
                    </div>
                </div>
            </div>
        </div>
    );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRef, useEffect, useState } from "react"

interface ProblemStatement {
  Statement_id: string
  Title: string
  Category: string
  Technology_Bucket: string
  Description: string
  DepartmentOrg: string
  Generated_Tags?: string[]
}

interface ProblemStatementCardProps {
  data: ProblemStatement
  position?: { x: number, y: number }
  expanded?: boolean
}

export function ProblemStatementCard({ data, position, expanded = false }: ProblemStatementCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    // Ensure this runs only when position is provided
    if (!position || !cardRef.current) return

    const calculateCardPosition = () => {
      const card = cardRef.current
      if (!card) return

      // Get card dimensions
      const cardRect = card.getBoundingClientRect()
      const cardHeight = cardRect.height
      const cardWidth = cardRect.width

      // Get viewport dimensions
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth

      // Starting position (where the user hovered/clicked)
      let left = position.x
      let top = position.y

      // Check if the card would go below the viewport
      if (top + cardHeight > viewportHeight - 20) {
        // Position the card above the hover point instead
        top = Math.max(20, top - cardHeight)
      }

      // Check if the card would go beyond right edge
      if (left + cardWidth > viewportWidth - 20) {
        left = Math.max(20, viewportWidth - cardWidth - 20)
      }

      // Set the final position
      setCardStyle({
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        zIndex: 50
      })
    }

    // Initial calculation
    calculateCardPosition()

    // Recalculate on window resize
    window.addEventListener('resize', calculateCardPosition)
    
    return () => {
      window.removeEventListener('resize', calculateCardPosition)
    }
  }, [position])

  // Apply styles based on whether position is provided
  return (
    <Card 
      ref={cardRef} 
      style={position ? cardStyle : undefined}
      className={`w-full max-w-[98vw] ${expanded ? 'md:max-w-2xl lg:max-w-3xl' : 'md:max-w-xl lg:max-w-2xl'} 
        bg-ctp-surface0 border-ctp-overlay0 hover:bg-ctp-surface1 transition-all duration-200 
        overflow-hidden flex flex-col shadow-lg 
        ${expanded ? 'border-ctp-blue' : 'hover:ring-2 hover:ring-ctp-sapphire/40 cursor-pointer'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-ctp-text text-lg font-semibold leading-tight line-clamp-2">
            {data.Title}
          </CardTitle>
          <Badge variant="secondary" className="bg-ctp-blue text-ctp-base text-xs shrink-0">
            {data.Statement_id}
          </Badge>
        </div>
        <CardDescription className="text-ctp-subtext1">
          {data.DepartmentOrg}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-ctp-text text-sm leading-relaxed">
          <p className={expanded ? "" : "line-clamp-4"}>{data.Description}</p>
          {!expanded && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-ctp-sapphire mr-1 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path>
                </svg>
                <p className="text-ctp-sapphire text-sm font-medium">Click for detailed view in sidebar</p>
              </div>
              <button className="py-1 px-2 bg-ctp-sapphire text-ctp-base text-xs rounded-full flex items-center hover:bg-ctp-sapphire/90 transition-colors">
                View Details
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-ctp-subtext0 text-xs font-medium whitespace-nowrap">Category:</span>
            <Badge variant="outline" className="border-ctp-green text-ctp-green truncate">
              {data.Category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-ctp-subtext0 text-xs font-medium whitespace-nowrap">Tech Bucket:</span>
            <Badge variant="outline" className="border-ctp-yellow text-ctp-yellow truncate">
              {data.Technology_Bucket}
            </Badge>
          </div>
        </div>
        
        {data.Generated_Tags && data.Generated_Tags.length > 0 && (
          <div className="space-y-1">
            <span className="text-ctp-subtext0 text-xs font-medium">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {data.Generated_Tags.slice(0, 5).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-ctp-surface1 text-ctp-text text-xs hover:bg-ctp-surface2"
                >
                  {tag}
                </Badge>
              ))}
              {data.Generated_Tags.length > 5 && (
                <Badge 
                  variant="secondary" 
                  className="bg-ctp-surface1 text-ctp-text text-xs"
                >
                  +{data.Generated_Tags.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

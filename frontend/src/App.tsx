import './App.css'
import '@/index.css'
import ForceGraph2D from 'react-force-graph-2d';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { ProblemStatementCard } from "@/components/ProblemStatementCard"
import { ProblemStatementSidebar } from "@/components/ProblemStatementSidebar"
import { MyShortlists } from "@/components/MyShortlists"

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import React from 'react';

import categoriesData from './data/categories.json'
import departmentOrgsData from './data/department_orgs.json'
import problemStatementsData from './data/problem_statements_with_tags.json'

// Define node type
interface GraphNode {
    id: string;
    name: string;
    category: string;
    department: string;
    techBucket: string;
    description: string;
    tags?: string[];
    nodeType?: 'problem' | 'techBucket';
    val?: number;
    x?: number;
    y?: number;
    index?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
}

function App() {
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [selectedDepartment, setSelectedDepartment] = useState<string>();
    const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
    const [clickedNode, setClickedNode] = useState<GraphNode | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphRef = useRef<any>(null);
    
  
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Update dimensions when the window is resized or sidebar state changes
    useEffect(() => {
        function handleResize() {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        
        // Initial call and event listener
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]); // Re-run when sidebar opens/closes
    

    useEffect(() => {
        function handleBackgroundClick(event: MouseEvent) {
            if (
                clickedNode && 
                event.target instanceof HTMLCanvasElement && 
                !hoveredNode
            ) {
                setClickedNode(null);
                setIsSidebarOpen(false);
            }
        }
        
        window.addEventListener('click', handleBackgroundClick);
        return () => window.removeEventListener('click', handleBackgroundClick);
    }, [clickedNode, hoveredNode]);
    
    // No longer clear clicked node when hovering away - let the sidebar stay open
    // We'll keep this commented for reference
    /*
    useEffect(() => {
        if (hoveredNode === null && clickedNode !== null) {
            setClickedNode(null);
            setIsSidebarOpen(false);
        }
    }, [hoveredNode, clickedNode]);
    */

    const filteredData = useMemo(() => {
   
        const filteredProblemNodes = problemStatementsData
            .filter(u =>
                (!selectedCategory || selectedCategory === "all" || u.Category === selectedCategory) &&
                (!selectedDepartment || selectedDepartment === "all" || u.DepartmentOrg === selectedDepartment) 
            )
            .map((u) => ({
                id: u.Statement_id,
                name: u.Title,
                category: u.Category,
                department: u.DepartmentOrg,
                techBucket: u.Technology_Bucket,
                description: u.Description,
                tags: u.Generated_Tags,
                nodeType: 'problem' as const,
                val: 8 // Smaller size for problem nodes
            }));
        
        // Extract unique tech buckets from the filtered nodes
        const uniqueTechBuckets = Array.from(
            new Set(filteredProblemNodes.map(node => node.techBucket))
        );
        
        // Create tech bucket nodes with calculated sizes
        const techBucketNodes = uniqueTechBuckets.map(bucket => {
            const connectedNodes = filteredProblemNodes.filter(n => n.techBucket === bucket).length;
            return {
                id: `tech-${bucket}`,
                name: bucket,
                category: "Tech Bucket",
                nodeType: 'techBucket' as const,
                techBucket: bucket,
                description: `Tech Bucket: ${bucket}`,
                department: "",
                val: 20 + (connectedNodes * 2) // Larger size based on connections
            };
        });
        
        // Combine all nodes
        const allNodes = [...filteredProblemNodes, ...techBucketNodes];
        
        // Create links between problem nodes and their tech bucket nodes
        const techBucketLinks = filteredProblemNodes.map(node => ({
            source: node.id,
            target: `tech-${node.techBucket}`,
            value: 0.5,
            color: 'rgba(100, 150, 200, 0.15)',
        }));
        
        return { nodes: allNodes, links: techBucketLinks };
    }, [selectedCategory, selectedDepartment]);


    const forceUpdate = useCallback(() => {
        if (graphRef.current) {
            const fg = graphRef.current;
            
            // Configure the force simulation
            fg.d3Force('link')
                .distance(120) // Increase link distance
                .strength(0.1); // Reduce link strength
            
            fg.d3Force('charge')
                .strength(-300) // Stronger repulsion between nodes
                .distanceMax(500);
            
            fg.d3Force('center')
                .strength(0.05); // Gentle centering force
        }
    }, []);

    // Apply force configuration when graph changes
    useEffect(() => {
        forceUpdate();
    }, [filteredData, forceUpdate]);

    // Generate consistent colors with Catppuccin Mocha palette
    const stringToColor = (str: string, nodeType?: string) => {
        if (nodeType === 'techBucket') {
            // Catppuccin Mocha colors for tech buckets - more vibrant
            const techColors = [
                '#f38ba8', // red
                '#fab387', // peach
                '#f9e2af', // yellow
                '#a6e3a1', // green
                '#94e2d5', // teal
                '#89dceb', // sky
                '#74c7ec', // sapphire
                '#b4befe'  // lavender
            ];
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return techColors[Math.abs(hash) % techColors.length];
        }
        
        // Softer Catppuccin Mocha colors for problem nodes
        const colors = [
            '#cba6f7', // mauve
            '#f5c2e7', // pink
            '#eba0ac', // maroon
            '#f2cdcd', // flamingo
            '#b4befe', // lavender 
            '#89dceb', // sky
            '#94e2d5', // teal
            '#a6e3a1'  // green
        ];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-ctp-base to-ctp-crust text-ctp-text flex flex-col p-4">
            <div className="flex flex-row space-x-4 mb-4 z-10">
                {/* Category filter */}
                <Select onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px] bg-ctp-mantle/80 backdrop-blur border border-ctp-surface0 text-ctp-text">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-ctp-base text-ctp-text border border-ctp-surface0">
                        <SelectItem value="all" className="hover:bg-ctp-surface0">
                            All Categories
                        </SelectItem>
                        {categoriesData.map((category, index) => (
                            <SelectItem key={index} value={category} className="hover:bg-ctp-surface0">
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Department filter */}
                <Select onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[180px] bg-ctp-mantle/80 backdrop-blur border border-ctp-surface0 text-ctp-text">
                        <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent className="bg-ctp-base text-ctp-text border border-ctp-surface0">
                        <SelectItem value="all" className="hover:bg-ctp-surface0">
                            All Organizations
                        </SelectItem>
                        {departmentOrgsData.map((org, index) => (
                            <SelectItem key={index} value={org} className="hover:bg-ctp-surface0">
                                {org}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div 
                className="relative flex-1"
                onMouseMove={(event: React.MouseEvent) => {
                    setTooltipPos({ x: event.clientX, y: event.clientY });
                }}
            >
                <ForceGraph2D 
                    ref={graphRef}
                    graphData={filteredData}
                    nodeVal={node => node.val || 1}
                    width={dimensions.width - (isSidebarOpen ? 480 : 32)} // Adjust width based on sidebar
                    height={dimensions.height - 100}
                    enableZoomInteraction={true}
                    enablePanInteraction={true}
                    minZoom={0.1}
                    maxZoom={10}
                    backgroundColor="transparent"
                    linkColor={() => 'rgba(116, 199, 236, 0.2)'} // ctp-sapphire with transparency
                    linkWidth={2}
                    linkDirectionalParticles={2}
                    linkDirectionalParticleWidth={2}
                    linkDirectionalParticleSpeed={0.003}
                    linkDirectionalParticleColor={() => 'rgba(137, 220, 235, 0.8)'} // ctp-sky with transparency
                    cooldownTicks={100}
                    warmupTicks={100}
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const typedNode = node as GraphNode;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        
                        const x = typedNode.x || 0;
                        const y = typedNode.y || 0;
                        
                        if (typedNode.nodeType === 'techBucket') {
                            // Draw hexagon for tech bucket with glow effect
                            const nodeSize = Math.sqrt(typedNode.val || 20) * 2;
                            
                            // Glow effect - using Catppuccin colors
                            ctx.shadowBlur = 20;
                            ctx.shadowColor = stringToColor(typedNode.techBucket, 'techBucket');
                            
                            ctx.beginPath();
                            const sides = 6;
                            const a = (Math.PI * 2) / sides;
                            
                            for (let i = 0; i < sides; i++) {
                                const pointX = x + nodeSize * Math.cos(a * i - Math.PI / 6);
                                const pointY = y + nodeSize * Math.sin(a * i - Math.PI / 6);
                                if (i === 0) ctx.moveTo(pointX, pointY);
                                else ctx.lineTo(pointX, pointY);
                            }
                            ctx.closePath();
                            
                            // Gradient fill with Catppuccin colors
                            const gradient = ctx.createRadialGradient(x, y, 0, x, y, nodeSize);
                            const baseColor = stringToColor(typedNode.techBucket, 'techBucket');
                            gradient.addColorStop(0, baseColor);
                            gradient.addColorStop(1, baseColor + '88');
                            ctx.fillStyle = gradient;
                            ctx.fill();
                            
                            ctx.strokeStyle = 'rgba(205, 214, 244, 0.8)'; // ctp-text color with transparency
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            
                            // Reset shadow
                            ctx.shadowBlur = 0;
                            
                            // Label for tech buckets
                            ctx.fillStyle = '#cdd6f4'; // ctp-text color
                            ctx.font = `bold ${10 / globalScale}px sans-serif`;
                            ctx.fillText(typedNode.name, x, y);
                            
                        } else {
                            // Circular nodes for problem statements with subtle glow
                            const nodeSize = Math.sqrt(typedNode.val || 8);
                            
                            // Subtle glow
                            ctx.shadowBlur = 10;
                            ctx.shadowColor = stringToColor(typedNode.category);
                            
                            ctx.beginPath();
                            ctx.arc(x, y, nodeSize, 0, 2 * Math.PI);
                            
                            // Gradient fill with Catppuccin-inspired colors
                            const gradient = ctx.createRadialGradient(x, y, 0, x, y, nodeSize);
                            const baseColor = stringToColor(typedNode.category);
                            gradient.addColorStop(0, baseColor);
                            gradient.addColorStop(0.7, baseColor + 'CC');
                            gradient.addColorStop(1, baseColor + '88');
                            ctx.fillStyle = gradient;
                            ctx.fill();
                            
                            ctx.strokeStyle = 'rgba(205, 214, 244, 0.5)'; // ctp-text color with transparency
                            ctx.lineWidth = 1;
                            ctx.stroke();
                            
                            ctx.shadowBlur = 0;
                        }
                    }}
                    nodeLabel={() => ''}
                    onNodeHover={(node: GraphNode | null) => {
                        if (node && node.nodeType === 'problem') {
                            setHoveredNode(node);
                            document.body.style.cursor = 'pointer';
                        } else {
                            setHoveredNode(null);
                            document.body.style.cursor = 'default';
                        }
                    }}
                    onNodeClick={(node: GraphNode) => {
                        if (node && node.nodeType === 'problem') {
                            setClickedNode(node);
                            // Open the sidebar when a problem node is clicked
                            setIsSidebarOpen(true);
                        }
                        if (node && node.nodeType === 'problem' && clickedNode && clickedNode.id === node.id) {
                            setClickedNode(null);
                            setIsSidebarOpen(false);
                        }
                    }}
                    onEngineStop={() => forceUpdate()}
                />
                
                {/* Show the hover card only when hovering over a problem node that isn't clicked */}
                {hoveredNode && hoveredNode.nodeType === 'problem' && 
                  (!clickedNode || clickedNode.id !== hoveredNode.id) && (
                    <ProblemStatementCard 
                        data={problemStatementsData.find(ps => ps.Statement_id === hoveredNode.id) || problemStatementsData[0]}
                        position={{ x: tooltipPos.x, y: tooltipPos.y }}
                        expanded={false}
                    />
                )}
                
                {/* Sidebar for detailed problem statement information */}
                {clickedNode && clickedNode.nodeType === 'problem' && (
                    <ProblemStatementSidebar
                        data={problemStatementsData.find(ps => ps.Statement_id === clickedNode.id) || null}
                        isOpen={isSidebarOpen}
                        onClose={() => {
                            setIsSidebarOpen(false);
                            setClickedNode(null);
                        }}
                    />
                )}
                
                {/* MyShortlists component in bottom left */}
                <MyShortlists />
            </div>
        </div>
    );
}

export default App;
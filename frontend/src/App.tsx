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
    // ForceGraph component instance reference with type casting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphRef = useRef<any>(null);
    
    // Track window size for responsive layout
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Update dimensions when the window is resized
    useEffect(() => {
        function handleResize() {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Handle clicks outside of nodes to clear the clicked node
    useEffect(() => {
        function handleBackgroundClick(event: MouseEvent) {
            if (
                clickedNode && 
                event.target instanceof HTMLCanvasElement && 
                !hoveredNode
            ) {
                setClickedNode(null);
            }
        }
        
        window.addEventListener('click', handleBackgroundClick);
        return () => window.removeEventListener('click', handleBackgroundClick);
    }, [clickedNode, hoveredNode]);
    
    // Clear clicked node when hovering away from it
    useEffect(() => {
        if (hoveredNode === null && clickedNode !== null) {
            setClickedNode(null);
        }
    }, [hoveredNode, clickedNode]);

    const filteredData = useMemo(() => {
        // Filter problem statement nodes based on selected filters
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

    // Custom force engine configuration
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

    // Generate consistent colors with better palette
    const stringToColor = (str: string, nodeType?: string) => {
        if (nodeType === 'techBucket') {
            // Special colors for tech buckets - more vibrant
            const techColors = [
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
                '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
            ];
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return techColors[Math.abs(hash) % techColors.length];
        }
        
        // Softer colors for problem nodes
        const colors = [
            '#B8E6B8', '#FFE4B5', '#E6E6FA', '#F0E68C',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#FFB6C1'
        ];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-ctp-text flex flex-col p-4">
            <div className="flex flex-row space-x-4 mb-4 z-10">
                {/* Category filter */}
                <Select onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px] bg-gray-800/80 backdrop-blur border border-gray-700 text-gray-100">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 text-gray-100 border border-gray-700">
                        <SelectItem value="all" className="hover:bg-gray-800">
                            All Categories
                        </SelectItem>
                        {categoriesData.map((category, index) => (
                            <SelectItem key={index} value={category} className="hover:bg-gray-800">
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Department filter */}
                <Select onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[180px] bg-gray-800/80 backdrop-blur border border-gray-700 text-gray-100">
                        <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 text-gray-100 border border-gray-700">
                        <SelectItem value="all" className="hover:bg-gray-800">
                            All Organizations
                        </SelectItem>
                        {departmentOrgsData.map((org, index) => (
                            <SelectItem key={index} value={org} className="hover:bg-gray-800">
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
                    width={dimensions.width - 32}
                    height={dimensions.height - 100}
                    enableZoomInteraction={true}
                    enablePanInteraction={true}
                    minZoom={0.1}
                    maxZoom={10}
                    backgroundColor="transparent"
                    linkColor={() => 'rgba(100, 150, 200, 0.2)'}
                    linkWidth={2}
                    linkDirectionalParticles={2}
                    linkDirectionalParticleWidth={2}
                    linkDirectionalParticleSpeed={0.003}
                    linkDirectionalParticleColor={() => 'rgba(100, 200, 255, 0.8)'}
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
                            
                            // Glow effect
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
                            
                            // Gradient fill
                            const gradient = ctx.createRadialGradient(x, y, 0, x, y, nodeSize);
                            const baseColor = stringToColor(typedNode.techBucket, 'techBucket');
                            gradient.addColorStop(0, baseColor);
                            gradient.addColorStop(1, baseColor + '88');
                            ctx.fillStyle = gradient;
                            ctx.fill();
                            
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            
                            // Reset shadow
                            ctx.shadowBlur = 0;
                            
                            // Label for tech buckets
                            ctx.fillStyle = 'white';
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
                            
                            // Gradient fill
                            const gradient = ctx.createRadialGradient(x, y, 0, x, y, nodeSize);
                            const baseColor = stringToColor(typedNode.category);
                            gradient.addColorStop(0, baseColor);
                            gradient.addColorStop(0.7, baseColor + 'CC');
                            gradient.addColorStop(1, baseColor + '88');
                            ctx.fillStyle = gradient;
                            ctx.fill();
                            
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
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
                        }
                    }}
                    onEngineStop={() => forceUpdate()}
                />
                
                {hoveredNode && hoveredNode.nodeType === 'problem' && (
                    <ProblemStatementCard 
                        data={problemStatementsData.find(ps => ps.Statement_id === hoveredNode.id) || problemStatementsData[0]}
                        position={{ x: tooltipPos.x, y: tooltipPos.y }}
                        expanded={!!clickedNode && clickedNode.id === hoveredNode.id}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
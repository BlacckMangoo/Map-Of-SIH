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

import { useState, useMemo } from "react";

// Import all JSON data
import categoriesData from './data/categories.json'
import departmentOrgsData from './data/department_orgs.json'
import techBucketsData from './data/tech_buckets.json'
import problemStatementsData from './data/problem_statements_with_tags.json'

function App() {
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [selectedDepartment, setSelectedDepartment] = useState<string>();
    const [selectedTechBucket, setSelectedTechBucket] = useState<string>();

    const filteredData = useMemo(() => {
        const filteredNodes = problemStatementsData
            .filter(u =>
                (!selectedCategory || selectedCategory === "all" || u.Category === selectedCategory) &&
                (!selectedDepartment || selectedDepartment === "all" || u.DepartmentOrg === selectedDepartment) &&
                (!selectedTechBucket || selectedTechBucket === "all" || u.Technology_Bucket === selectedTechBucket)
            )
            .map((u) => ({
                id: u.Statement_id,
                name: u.Title,
                category: u.Category,
                department: u.DepartmentOrg,
                techBucket: u.Technology_Bucket,
            }));

        const filteredLinks = [];
        if (filteredNodes.length > 1) {
            filteredLinks.push({
                source: filteredNodes[0].id,
                target: filteredNodes[1].id
            });
        }

        return { nodes: filteredNodes, links: filteredLinks };
    }, [selectedCategory, selectedDepartment, selectedTechBucket]);

    return (
        <div className="min-h-screen bg-ctp-base text-ctp-text flex flex-col p-4">
            <div className="flex flex-row space-x-4">
                {/* Category filter */}
                <Select onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px] bg-ctp-surface0 border border-ctp-overlay0 text-ctp-text">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-ctp-mantle text-ctp-text border border-ctp-overlay1">
                        <SelectItem value="all" className="hover:bg-ctp-surface1">
                            All Categories
                        </SelectItem>
                        {categoriesData.map((category, index) => (
                            <SelectItem key={index} value={category} className="hover:bg-ctp-surface1">
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Department filter */}
                <Select onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[180px] bg-ctp-surface0 border border-ctp-overlay0 text-ctp-text">
                        <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent className="bg-ctp-mantle text-ctp-text border border-ctp-overlay1">
                        <SelectItem value="all" className="hover:bg-ctp-surface1">
                            All Organizations
                        </SelectItem>
                        {departmentOrgsData.map((org, index) => (
                            <SelectItem key={index} value={org} className="hover:bg-ctp-surface1">
                                {org}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Tech Bucket filter */}
                <Select onValueChange={setSelectedTechBucket}>
                    <SelectTrigger className="w-[180px] bg-ctp-surface0 border border-ctp-overlay0 text-ctp-text">
                        <SelectValue placeholder="Select Tech Bucket" />
                    </SelectTrigger>
                    <SelectContent className="bg-ctp-mantle text-ctp-text border border-ctp-overlay1">
                        <SelectItem value="all" className="hover:bg-ctp-surface1">
                            All Tech Buckets
                        </SelectItem>
                        {techBucketsData.map((bucket, index) => (
                            <SelectItem key={index} value={bucket} className="hover:bg-ctp-surface1">
                                {bucket}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <ForceGraph2D 
            graphData={filteredData}
            nodeAutoColorBy="category"
            nodeRelSize={10}
            width={window.innerWidth}
            height={window.innerHeight}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            minZoom={0.1}
            maxZoom={50}
            backgroundColor="transparent"
        />
        </div>
    );
}

export default App;

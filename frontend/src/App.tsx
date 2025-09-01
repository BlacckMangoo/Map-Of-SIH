
import './App.css'
import '@/index.css'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Import all JSON data
import categoriesData from './data/categories.json'
import departmentOrgsData from './data/department_orgs.json'
import techBucketsData from './data/tech_buckets.json'



function App() {


  return (
      <div className="min-h-screen bg-ctp-base text-ctp-text flex flex-col p-4">
      

          <div className='flex flex-row space-x-4'>
              <Select>
              <SelectTrigger className="w-[180px] bg-ctp-surface0 border border-ctp-overlay0 text-ctp-text">
                  <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-ctp-mantle text-ctp-text border border-ctp-overlay1">
                  {categoriesData.map((category, index) => (
                      <SelectItem key={index} value={category} className="hover:bg-ctp-surface1">
                          {category}
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>

            <Select>
              <SelectTrigger className="w-[180px] bg-ctp-surface0 border border-ctp-overlay0 text-ctp-text">
                  <SelectValue placeholder="Select Organization" />
              </SelectTrigger>
              <SelectContent className="bg-ctp-mantle text-ctp-text border border-ctp-overlay1">
                  {departmentOrgsData.map((category, index) => (
                      <SelectItem key={index} value={category} className="hover:bg-ctp-surface1">
                          {category}
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>

            <Select>
              <SelectTrigger className="w-[180px] bg-ctp-surface0 border border-ctp-overlay0 text-ctp-text">
                  <SelectValue placeholder="Select Tech Bucket" />
              </SelectTrigger>
              <SelectContent className="bg-ctp-mantle text-ctp-text border border-ctp-overlay1">
                  {techBucketsData.map((category, index) => (
                      <SelectItem key={index} value={category} className="hover:bg-ctp-surface1">
                          {category}
                      </SelectItem>
                  ))}
              </SelectContent>
          </Select>







          </div>
     
        

      </div>
  )
}

export default App

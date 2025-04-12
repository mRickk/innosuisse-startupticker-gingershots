import React from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const SearchEngine = () => {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const handleSearch = async () => {
    // if (!query.trim()) return
    // try {
    //   setLoading(true)
    //   const response = await fetch('/api/search', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ query }),
    //   })
    //   const data = await response.json()
    //   setResults(data.results)
    // } catch (error) {
    //   console.error('Search failed:', error)
    // } finally {
    //   setLoading(false)
    // }
    const data = JSON.parse(JSON.stringify([
      {
        "declaration_code": "const barData = {\n    labels: ['ZH', 'VD', 'VS', 'BL', 'GE'],\n    datasets: [\n        {\n            label: 'Total Funding (Top 5 Cantons)',\n            data: [11614.360, 7478.065, 297.000, 960.050, 3926.690],\n            backgroundColor: 'rgba(75, 192, 192, 0.2)',\n            borderColor: 'rgba(75, 192, 192, 1)',\n            borderWidth: 1,\n        },\n    ],\n};",
        "chart_code": "<div className=\"bg-white border-2 border-gray-100 rounded-lg p-4 mb-10\">\n    <h5 className=\"text-lg font-medium text-gray-800 mb-4\">Top 5 Funding Cantons</h5>\n    <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />\n</div>",
        "description": "This bar chart displays the total funding amounts for the top 5 cantons with the highest funding. The bar chart is ideal for comparing quantities across different categories, making it easy to identify which cantons contribute the most to the total funding."
      },
      {
        "declaration_code": "const pieData = {\n    labels: ['ZH', 'VD', 'VS', 'BL', 'GE', 'Other'],\n    datasets: [\n        {\n            label: 'Total Funding Distribution',\n            data: [11614.360, 7478.065, 297.000, 960.050, 3926.690, 4052.725],\n            backgroundColor: ['#75B8B8', '#FECEA8', '#FDAEA1', '#80BD9E', '#A5C4DD', '#B96E51'],\n        },\n    ],\n};",
        "chart_code": "<div className=\"bg-white border-2 border-gray-100 rounded-lg p-4 mb-10\">\n    <h5 className=\"text-lg font-medium text-gray-800 mb-4\">Funding Distribution Summary</h5>\n    <Pie data={pieData} options={{ responsive: true }} />\n</div>",
        "description": "This pie chart shows the distribution of total funding across different cantons, with the remaining funding grouped under 'Other'. The pie chart is particularly effective for showing proportions and how the total funding is divided among different regions."
      },
      {
        "declaration_code": "const horizontalBarData = {\n    labels: ['AG', 'AR', 'BE', 'BS', 'BL', 'GE', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'Vaud', 'ZH'],\n    datasets: [\n        {\n            label: 'Total Funding by Canton',\n            data: [76.350, 20.340, 30.450, 4882.070, 960.050, 3926.690, 16.700, 1.200, 1.000, 113.500, 17.900, 18.500, 349.870, 282.330, 15.900, 564.150, 27.800, 786.780, 1.850, 205.880, 297.000, 338.740, 11614.360],\n            backgroundColor: 'rgba(75, 192, 192, 0.2)',\n            borderColor: 'rgba(75, 192, 192, 1)',\n            borderWidth: 1,\n        },\n    ],\n};",
        "chart_code": "<div className=\"bg-white border-2 border-gray-100 rounded-lg p-4\">\n    <h5 className=\"text-lg font-medium text-gray-800 mb-4\">Funding by Canton</h5>\n    <HorizontalBar data={horizontalBarData} options={{ responsive: true, maintainAspectRatio: false }} />\n</div>",
        "description": "This horizontal bar chart provides a comprehensive view of total funding across all cantons. It allows for easy comparison of funding amounts at a glance while accommodating the full list of cantons. The horizontal layout is particularly useful for displaying numerous categories without overcrowding the visualization."
      }
    ]));
    setResults(data)

  }

  return (
    <div className="p-6 max-w-3xl mx-auto mt-20">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter your prompt..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 text-sm text-[#1F2937] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2937] focus:border-transparent "
        />
        <button 
          onClick={handleSearch}
          disabled={loading}
          className={`flex items-center justify-center px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#1F2937] disabled:opacity-50 ${
            loading ? 'bg-[#E90A32]' : 'bg-[#1F2937] hover:bg-opacity-80'
          }`}
          style={{
            transition: 'background-color 0.3s ease-out',
          }}
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="space-y-6">
        {results.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-white shadow-xl rounded-2xl p-4">
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <code>{item.code}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {query.trim() && results.length === 0 && !loading && (
        <div className="text-center p-8 text-gray-500">
          No results found. Try modifying your search.
        </div>
      )}
    </div>
  )
}

export default SearchEngine
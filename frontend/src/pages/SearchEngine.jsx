import React from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import * as Babel from '@babel/standalone'
import { Bubble, Pie, Bar } from 'react-chartjs-2';

const compileJSX = (jsxCode) => {
  try {
    const wrappedCode = `
      (function(React, Bubble, Pie, Bar) {
        return function RenderedChart() {
          return (${jsxCode});
        }
      })
    `;

    const transformed = Babel.transform(wrappedCode, {
      presets: ['react'],
    }).code;

    // This creates the function from the transformed code
    const factoryFn = eval(transformed); // eslint-disable-line no-eval
    const RenderedChart = factoryFn(React, Bubble, Pie, Bar);

    return RenderedChart;
  } catch (err) {
    console.error('❌ Failed to compile JSX:', err);
    return () => <div className="text-red-500">Error rendering chart</div>;
  }
};


const SearchEngine = () => {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [selectedRegion, setSelectedRegion] = React.useState('Switzerland'); // Default selection

  const handleRegionChange = async (region) => {
    setSelectedRegion(region);
    try {
      // Send a request to the backend to update the database
      const response = await fetch('/api/set-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ region }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to switch database: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log(`Database switched to: ${data.message}`);
    } catch (error) {
      console.error('Failed to switch database:', error);
    }
  };

  // const handleSearch = async () => {
  //   if (!query.trim()) return
  //   try {
  //     setLoading(true)
  //     const response = await fetch('/api/search', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ query }),
  //     })
  //     const data = await response.json()
  //     setResults(data.results)
  //   } catch (error) {
  //     console.error('Search failed:', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      setResults([]); // Clear previous results
      // Dummy data instead of fetching from an API
      const dummyData = JSON.parse(JSON.stringify([{'code': '<div className="bg-white border-2 border-gray-100 rounded-lg p-4 mb-10">\n    <h5 className="text-lg font-medium text-gray-800 mb-4">Total Funding by Canton</h5>\n    <Bar data={{\n        labels: [\'ZH\', \'VD\', \'BS\', \'GE\', \'ZG\', \'None\', \'LU\', \'BL\', \'TI\', \'Zug\', \'SZ\', \'SG\', \'Zürich\', \'VS\', \'SH\', \'BE\', \'Vaud\', \'GL\', \'Basel-Stadt\', \'FR\', \'NE\', \'Basel-Landschaft\', \'AG\', \'Genève\', \'Bern\', \'TG\', \'Schwyz\', \'AR\', \'OW\', \'NW\', \'Aargau\', \'GR\', \'SO\', \'Schaffhausen\', \'Valais / Wallis\', \'Abroad\', \'Ticino\', \'St. Gallen\', \'Fribourg / Freiburg\', \'UR\', \'JU\', \'Jura\', \'Luzern\', \'Solothurn\', \'Obwalden\', \'Neuchâtel\', \'Appenzell Innerrhoden\', \'Thurgau\'],\n        datasets: [\n            {\n                label: \'Total Funding (Millions)\',\n                data: [11614.36, 7478.065, 4882.07, 3926.69, 3273.69, 1740.95, 1426.425, 960.05, 786.78, 583.775, 564.15, 349.87, 338.74, 297, 282.33, 273.29, 205.88, 185, 184.165, 148.36, 113.5, 85.46, 76.35, 68.36, 30.45, 27.8, 26.49, 20.34, 18.5, 17.9, 17.125, 16.7, 15.9, 8.3, 7.65, 6.2, 4.6, 4.12, 3.17, 1.85, 1.2, 1, 0.94, 0.8, 0.315, 0.2, 0.025, NaN],\n                backgroundColor: \'rgba(75, 192, 192, 0.2)\',\n                borderColor: \'rgba(75, 192, 192, 1)\',\n                borderWidth: 1,\n            },\n        ],\n    }} />\n</div>', 'description': 'A bar chart showing the total funding amounts for each canton. This chart provides a clear comparison of funding across different regions, making it easy to identify which cantons have received the most funding.'}, {'code': '<div className="bg-white border-2 border-gray-100 rounded-lg p-4 mb-10">\n    <h5 className="text-lg font-medium text-gray-800 mb-4">Top 5 Funding by Canton</h5>\n    <Pie data={{\n        labels: [\'ZH\', \'VD\', \'BS\', \'GE\', \'Others\'],\n        datasets: [\n            {\n                label: \'Total Funding (Millions)\',\n                data: [11614.36, 7478.065, 4882.07, 3926.69, 1740.95 + 1426.425 + 960.05 + 786.78 + 583.775 + 564.15 + 349.87 + 338.74 + 297 + 282.33 + 273.29 + 205.88 + 185 + 184.165 + 148.36 + 113.5 + 85.46 + 76.35 + 68.36 + 30.45 + 27.8 + 26.49 + 20.34 + 18.5 + 17.9 + 17.125 + 16.7 + 15.9 + 8.3 + 7.65 + 6.2 + 4.6 + 4.12 + 3.17 + 1.85 + 1.2 + 1 + 0.94 + 0.8 + 0.315 + 0.2 + 0.025],\n                backgroundColor: [\'#1E88E5\', \'#FFC107\', \'#2E7D32\', \'#9C27B0\', \'#8E8E8E\'],\n                borderColor: \'#fff\',\n                borderWidth: 1,\n            },\n        ],\n    }} />\n</div>', 'description': "A pie chart showing the distribution of total funding across the top 5cantons, with the remaining cantons grouped into 'Others'. This chart provides a quick overview of the proportion of funding each region receives."}, {'code': '<div className="bg-white border-2 border-gray-100 rounded-lg p-4 mb-10">\n    <h5 className="text-lg font-medium text-gray-800 mb-4">Funding Distribution Map</h5>\n    <Bubble data={{\n        labels: [\'ZH\', \'VD\', \'BS\', \'GE\', \'ZG\', \'None\', \'LU\', \'BL\', \'TI\', \'Zug\', \'SZ\', \'SG\', \'Zürich\', \'VS\', \'SH\', \'BE\', \'Vaud\', \'GL\', \'Basel-Stadt\', \'FR\', \'NE\', \'Basel-Landschaft\', \'AG\', \'Genève\', \'Bern\', \'TG\', \'Schwyz\', \'AR\', \'OW\', \'NW\', \'Aargau\', \'GR\', \'SO\', \'Schaffhausen\', \'Valais / Wallis\', \'Abroad\', \'Ticino\', \'St. Gallen\', \'Fribourg / Freiburg\', \'UR\', \'JU\', \'Jura\', \'Luzern\', \'Solothurn\', \'Obwalden\', \'Neuchâtel\', \'Appenzell Innerrhoden\', \'Thurgau\'],\n        datasets: [\n            {\n                label: \'Total Funding (Millions)\',\n                data: [11614.36, 7478.065, 4882.07, 3926.69, 3273.69, 1740.95, 1426.425, 960.05, 786.78, 583.775, 564.15, 349.87, 338.74, 297, 282.33, 273.29, 205.88, 185, 184.165, 148.36, 113.5, 85.46, 76.35, 68.36, 30.45, 27.8, 26.49, 20.34, 18.5, 17.9, 17.125, 16.7, 15.9, 8.3, 7.65, 6.2, 4.6, 4.12, 3.17, 1.85, 1.2, 1, 0.94, 0.8, 0.315, 0.2, 0.025],\n                backgroundColor: \'rgba(54, 162, 235, 0.2)\',\n                borderColor: \'rgba(54, 162, 235, 1)\',\n                borderWidth: 1,\n            },\n        ],\n    }} />\n</div>', 'description': 'A bubble chart showing the distribution of funding across all cantons. The size of each bubble represents the total funding amount, providing a visual representation of the relative funding amounts between different regions.'}]));
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Sleep
      setResults(dummyData); // Set the filtered results based on the query
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-3xl mx-auto mt-20">
      {/* Dropdown for region selection */}
      <div className="mb-6">
        <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Region:
        </label>
        <select
          id="region-select"
          value={selectedRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2937]"
        >
          <option value="Switzerland">Switzerland</option>
          <option value="World">World</option>
        </select>
      </div>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter your prompt..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 text-sm text-[#1F2937] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1F2937] focus:border-transparent "
        />
        <button 
          onClick={() => handleSearch()}
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

      <div className="space-y-6 mt-5">
        {results.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-white shadow-lg rounded-2xl p-4 border-2 border-gray-100">
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                {/* PROBLEMATIC PART */}
                <div className="mt-2">
                  {React.createElement(compileJSX(item.code))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* <div className="space-y-6 mt-20">
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
                <div
                  className="bg-gray-100 p-3 rounded text-sm overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: item.chart_code }}
                />
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto mt-4">
                  <code>{item.declaration_code}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        ))}
      </div> */}


      
      {query.trim() && results.length === 0 && !loading && (
        <div className="text-center p-8 text-gray-500">
          No results found. Try modifying your search.
        </div>
      )}
    </div>
  )
}

export default SearchEngine
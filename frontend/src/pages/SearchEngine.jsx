import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const SearchEngine = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async () => {
    if (!query.trim()) return
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter your prompt..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {results.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="shadow-xl rounded-2xl p-4">
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <code>{item.code}</code>
                </pre>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SearchEngine

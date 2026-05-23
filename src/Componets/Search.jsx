import { useState, useEffect, useRef } from 'react'
import SearchInput from './SearchInput'

function Search() {
  const [query, setQuery]         = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults]     = useState([])
  const [error, setError]         = useState(null)
  const abortRef = useRef(null)

  useEffect(() => {
    const trimmed = query.trim()
    const encoded = encodeURIComponent(trimmed)
  
    if (!trimmed && trimmed.length < 2) {
      if (abortRef.current) abortRef.current.abort()
      setResults([])
      setIsLoading(false)
      return
    }
  
    const fetchSearch = async () => {
      if (abortRef.current) abortRef.current.abort()
      abortRef.current = new AbortController()
      setError(null)
      setIsLoading(true)
  
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${encoded}`,
          { signal: abortRef.current.signal }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
  
        const data = await res.json()
        const products = data?.products || []
        setResults(products)           
  
      } catch (err) {
        if (err.name !== 'AbortError') setError('Something went wrong.')
      } finally {
         setIsLoading(false)
      }
    }
  
    const timerID = setTimeout(fetchSearch, 300)
    return () => {
      clearTimeout(timerID)
    }
  }, [query])

  return (
    <div>
      <SearchInput query={query} setQuery={setQuery} />

      {isLoading && <p>Loading…</p>}
      {error     && <p style={{ color: 'red' }}>{error}</p>}

      {!isLoading && query.trim() && results.length === 0 && (
        <p>No Results Found</p>
      )}

      <div style={{ marginTop: '10px' }}>
      {
  results.length > 0 && (
    <div style={{border:"1px solid gray"}}>

      {
        results.map((item, index) => (

          <div
            key={item.id}
            style={{padding:"10px"}}
          >
            {item.title}
          </div>
        ))
      }

    </div>
  )
}
      </div>
    </div>
  )
}

export default Search
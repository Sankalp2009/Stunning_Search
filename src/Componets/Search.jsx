import { useState, useEffect, useRef } from 'react'
import SearchInput from './SearchInput'

function Search() {
  const [query, setQuery]     = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError]     = useState(null)
  const abortRef              = useRef(null)

  useEffect(() => {
    const trimmed = query.trim()

    if (!trimmed) {
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
        const res  = await fetch(
          `https://dummyjson.com/products/search?q=${trimmed}`,
          { signal: abortRef.current.signal }
        )
        const data = await res.json()
        setResults(data?.products || [])
      } catch (err) {
        if (err.name !== 'AbortError') setError('Something went wrong.')
      } finally {
        setIsLoading(false)
      }
    }

    const timerID = setTimeout(fetchSearch, 300)
    return () => clearTimeout(timerID)
  }, [query])

  return (
    <div>
      <SearchInput query={query} setQuery={setQuery} />

      {isLoading && <p>Loading…</p>}
      {error     && <p style={{ color: 'red' }}>{error}</p>}

      {!isLoading && query.trim() && results.length === 0 && (
        <h1>No Results Found</h1>
      )}

      <div style={{ marginTop: '10px', padding: '10px' }}>
        {results.map((el) => (
          <div key={el.id}>{el.title}</div>
        ))}
      </div>
    </div>
  )
}

export default Search
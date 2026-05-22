function SearchInput({query, setQuery}) {
  return (
    <div>
      <input 
      type="text" 
      name='search' 
      value={query}
      placeholder='Enter Search'  
      onChange={(e)=>{
        setQuery(e.target.value)
      }}
      />
    </div>
  )
}

export default SearchInput
import  {useState, useEffect} from 'react'
import SearchInput from './SearchInput'
function Search() {
  
  const [query, setQuery] =  useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  
  useEffect(()=>{
    // Fetch Part
    const trimmed = query.trim();
    const fetchSearch = async()=>{
      try {
        setIsLoading(true);
        let Res = await fetch(`https://dummyjson.com/products/search?q=${trimmed}`);
        let data = await Res.json();
        console.log(data?.products);
        setResults(data?.products)
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    
    const timerID = setTimeout(() => {
      fetchSearch()
    }, 500);
    
    return ()=> clearTimeout(timerID);

  },[query]);

  return (
    <div>
      <SearchInput query={query} setQuery={setQuery} />
      { isLoading && (<h2>Loading</h2>) }
      {!isLoading && results.length === 0 && <h1>No results Found</h1>}
      <div style={{border:"1px solid gray"}}>
      {results.map(el=>
        <div key={el.id}>
          {el.title}
        </div>
      )}
      </div>
    </div>
  )
}

export default Search
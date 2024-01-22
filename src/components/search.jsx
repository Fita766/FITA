'use client'
import { useRouter } from "next/navigation";
import { useCallback,useEffect,useState } from "react";

const Search = ({IsURL}) => {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    if (IsURL) {
      return router.push('/')
    }
  },[IsURL])
  
  const verifierUrl = (url) => {
    var pattern = /^https:\/\/www\.linkedin\.com\/search\/results\/[a-zA-Z]/;
    return pattern.test(url);
  }

  const handleClick = useCallback(() => {
    if (!searchValue) {
      return
    }
    if (!verifierUrl(searchValue)) {
      return
    }
      
      router.push(`/?url=${searchValue}`)
    
    },[searchValue])

  return (
   <div>
      <input
        type="text"
        placeholder="Mettre l'url pour agent phantombuster"
        value={searchValue}
        onChange={handleSearchChange}
      />
      <button onClick={handleClick}>Envoyer la recherche</button>
    </div>
  )
}

export default Search
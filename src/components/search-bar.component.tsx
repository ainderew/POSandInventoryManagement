import React from "react";

interface props{
    searchInputSetter: React.Dispatch<React.SetStateAction<string>>
    searchInput: string
}

const SearchBar: React.FC<props> =({searchInputSetter, searchInput}) =>{
    
    return(
        <input onChange={(e:React.ChangeEvent<HTMLInputElement>)=>searchInputSetter(e.target.value)} value={searchInput} placeholder="Search for item" type="text" className="w-full h-full  border-none outline-none bg-gray-200 px-4" />
    )
}

export default SearchBar;
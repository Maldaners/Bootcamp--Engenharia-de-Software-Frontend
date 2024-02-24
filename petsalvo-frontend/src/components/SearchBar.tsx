import { AiOutlineSearch } from "react-icons/ai"
import React, { useState } from "react";

export default function SearchBar({updateFilter}:any) {
    const [filter, changeFilter] = useState("")

    const getFilteredValue = (event: any) => {
        changeFilter(event.target.value)
    }

    const filterPets = () => {
        updateFilter(filter)
    }


    return (
        <div className="relative">
            <input onChange={getFilteredValue} className="w-full px-3 py-2 border border-black rounded-md" placeholder="Nome do Pet"/>
            <AiOutlineSearch onClick={filterPets} className="absolute cursor-pointer top-3 right-3 select-none" />
        </div>
    )
}
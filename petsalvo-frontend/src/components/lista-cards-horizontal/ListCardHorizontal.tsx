'use client'

import CardPetHorizontal from "@/components/CardPetHorizontal";
import SearchBar from "@/components/SearchBar";
import React, { useState } from "react";
import Pagination from "@/components/Pagination";
import CardUserHorizontal from "../CardUserHorizontal";
import BotaoVoltar from "@/components/BotaoVoltar";
import { useRouter } from "next/navigation";

export default function ListCardHorizontal({pets_list, label, userList}:any) {
    const [currentPage, setCurrentPage] = useState(1)
    const [filter, setFilter] = useState("")

    const itemsPerPage = 12
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        setFilter("")
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const itemsToShow = pets_list ? pets_list.filter(
        x => x.pet.nome.toLowerCase().includes(filter))
        .slice(startIndex, endIndex) 
        : null
    
    const filterPets = (petName: string) => {
        setCurrentPage(1)
        setFilter(petName)
    }
    
    userList ? userList = userList.filter(x => x.status == 1 || x.status == 2) : null

    const { push } = useRouter();

    const listaPets = () => {
        return(
            <>
               
                <div className="container mx-auto w-100 h-100 m-10 flex flex-col ">
                <div className="flex justify-between">
                        <div>
                            <BotaoVoltar id="voltar" text="Voltar" onClick={() => push('/')} />
                        </div>
                        <p className="text-4xl text-center">{label}</p>
                        <div className="w-20">
                        </div>
                    </div>
                    {itemsToShow.length > 0 ?
                    <>
                    <div className="lg:w-3/12 md:w-full sm:w-full mt-5">
                        <SearchBar updateFilter = {filterPets}/>
                    </div>
                    
                    <div className=" mt-10  max-h-[36rem] overflow-auto">
                        {itemsToShow.map(item => {
                            return (
                                <CardPetHorizontal key={item.pet.id+item.pet.nome} pet={item.pet} />
                            )
                        })}
                    </div>
                    <div className="paginate flex justify-center mt-5 mb-10">
                            <Pagination
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                items={pets_list}
                                onPageChange={handlePageChange}
                            />
                    </div>
                    </>
                     : <div className="text-center mt-10"> <p> Não há pets em processo de adoção no momento</p> </div>  
                    }
                </div>
               
            </>
        )
    }

    const listAdotantes = () => {
        return(
            <>
                <div className="container mx-auto w-100 h-100 m-10 flex flex-col ">
                    <div className="flex justify-between">
                        <div>
                            <BotaoVoltar id="voltar" text="Voltar" onClick={() => push('/adoption-requests')} />
                        </div>
                        <p className="text-4xl text-center">{label}</p>
                        <div className="w-20">
                        </div>
                    </div>
                    {userList.length > 0 ?
                    <>
                        <div className=" mt-10  max-h-[36rem] overflow-auto">
                            {userList.map(item => {
                                if(item.status == 1 || item.status == 2)
                                return (
                                    <CardUserHorizontal key={item.pet.idPet+item.adotante.idUsuario} user={item} />
                                )
                                else return (<></>)
                            })}
                        </div>
                        <div className="paginate flex justify-center mt-5 mb-10">
                                <Pagination
                                    currentPage={currentPage}
                                    itemsPerPage={itemsPerPage}
                                    items={userList}
                                    onPageChange={handlePageChange}
                                />
                        </div>
                    </>
                     : <div className="text-center mt-10"> Não há processo de adoção no momento </div>  
                    }
                </div>
            </>
        )
    }

    return (
    <div>
        {
           pets_list ? listaPets() : userList ? listAdotantes() : <></>
        }

    </div>
    )
}

'use client'
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import ListCardHorizontal from "@/components/lista-cards-horizontal/ListCardHorizontal";
import { adocaoService } from "@/services/adocao.service";


const CandidatesList = ({
    params,
}: {
    params: { idPet: number; };
}) => {

    const [userList, setUserList]: any = useState([])
    const [label, setLabel]: any = useState([])

    useEffect(() => {
        adocaoService.getAdotantesPet(params.idPet)
            .then((response: any) => {
                if (response.length > 0) setLabel(response[0].pet.nome)
                else setLabel("Lista de adotantes")
                setUserList(response);
            })
            .catch((error: any) => {
                console.error('Erro ao buscar matches:', error);
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1">
                <Navbar />
                <ListCardHorizontal userList={userList} label={label} />
            </div>
            <Footer />
        </div>
    )
}

export default CandidatesList
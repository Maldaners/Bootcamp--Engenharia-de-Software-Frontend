'use client'

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ListCardHorizontal from "@/components/lista-cards-horizontal/ListCardHorizontal";
import { adocaoService } from "@/services/adocao.service";
import React, { useEffect, useState } from "react";

export default function AdoptionRequests() {
    const [petsList, setPetsList]: any = useState([])

    useEffect(() => {
        adocaoService.getMatchesONG()
            .then((response: any) => {
                let listaPets = [];
                response.forEach(item => {
                    if (item.status != 1 && item.status != 2) return
                    if (listaPets.filter(x => x.pet.idPet == item.pet.idPet).length > 0) return
                    item.pet.idAdotante = item.adotante.idAdotante;
                    item.pet.data = item.dataCriacao.split('T')[0];
                    item.pet.key = item.idProcessoAdocao;
                    item.pet.quantidade = response.filter(x => x.pet.idPet == item.pet.idPet && x.status == 1).length;
                    item.pet.quantidadeMatches = response.filter(x => x.pet.idPet == item.pet.idPet && x.status == 2).length;
                    listaPets.push(item)
                })
                setPetsList(listaPets);
            })
            .catch((error: any) => {
                console.error('Erro ao buscar matches:', error);
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1">
                <Navbar />
                <ListCardHorizontal pets_list={petsList} label="Pets em processo de adoção" />
            </div>
            <Footer />
        </div>
    )
}

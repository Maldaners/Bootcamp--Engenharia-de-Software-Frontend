'use client'
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import ListCardHorizontal from "@/components/lista-cards-horizontal/ListCardHorizontal";
import { adocaoService } from "@/services/adocao.service";


export default function MyMatches() {

    const [petsList, setPetsList]: any = useState([])

    useEffect(() => {
        adocaoService.getMatchesAdotante()
            .then((response: any) => {
                response.forEach(item => {
                    item.pet.idAdotante = item.idAdotante;
                    item.pet.key = item.idProcessoAdocao;
                    item.pet.ong = item.ong.usuario.nome;
                    item.pet.status = item.status
                    item.pet.idProcessoAdocao = item.idProcessoAdocao;
                })
                const result = response
                setPetsList(result);
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

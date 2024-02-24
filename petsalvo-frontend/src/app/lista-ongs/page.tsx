'use client'
import React, { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ListaOngs from '@/components/lista-ongs/ListaOngs';
import MapaOngs from '@/components/lista-ongs/MapaOngs';
import SearchOng from '@/components/lista-ongs/SearchOng';
import Ong from '@/model/Ong';
import { ongService } from '@/services/ong.service';

const OngList = () => {
  const [listOngs, setListOngs] = useState<Ong[] | null>(null);
  const [filtro, setFiltro] = useState('');

  const fetchOngs = () => {
    ongService
      .listOngs()
      .then((listOngsFetch) => {
        setListOngs(listOngsFetch);
      })
      .catch((error) => {
        console.error('Erro ao buscar ongs:', error);
      });
  };

  useEffect(() => fetchOngs(), []);

  const handleSearchChange = (searchTerm: string) => {
    setFiltro(searchTerm.toLowerCase());
  };

  const ongsFiltradas = listOngs
    ? listOngs.filter(
      (ong) =>
        ong.usuario.nome.toLowerCase().includes(filtro) ||
        ong.endereco.rua.toLowerCase().includes(filtro) ||
        ong.endereco.bairro.toLowerCase().includes(filtro) ||
        ong.endereco.estado.toLowerCase().includes(filtro) ||
        ong.endereco.cidade.toLowerCase().includes(filtro)
    )
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Navbar />
        <div className="flex flex-col gap-6 lg:px-16 lg:py-20 max-w-7xl justify-center lg:flex-row px-5 py-5 lg:mx-auto">
          <div className="flex flex-col gap-4 items lg:min-w-[529px]">
            {ongsFiltradas.length ? (
              <>
                <SearchOng onSearchChange={handleSearchChange} />
                <ListaOngs ongDataList={ongsFiltradas} />
              </>
            ) : (
              <div>Nenhuma ong encontrada</div>
            )}
          </div>
          <MapaOngs ongDataList={ongsFiltradas} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OngList;
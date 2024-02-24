"use client";
import React, { useEffect, useState } from 'react';
import Pet from '@/model/Pet';
import { petService } from "@/services/pet.service";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VisualizarPet from '@/components/pet/VisualizarPet';
import AlterarPet from '@/components/pet/AlterarPet';
import { useRouter } from "next/navigation";
import { TipoUsuarioEnum } from '@/contexts/TipoUsuarioEnum';
import { getTipoUsuario, getIdUsuario } from '@/contexts/UserContext';
import { converterImagensParaFiles } from '@/utils/imagemUtils';

export default function PetPage({
  params,
}: {
  params: { idPet: string; idOng: string };
}) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [error, setError] = useState<string>('');
  const [telaAtual, setTelaAtual] = useState<'visualizar' | 'editar'>('visualizar');
  const [photos, setPhotos] = useState<string[]>([]);
  const { push } = useRouter();

  useEffect(() => {
    const fetchPetAndOngDetails = async () => {
      try {
        const tipoUsuario = getTipoUsuario();
        const idUsuario = getIdUsuario();
        let show = true;
        const petData: Pet = await petService.getPet(params.idPet, params.idOng);

        if (tipoUsuario === TipoUsuarioEnum.ONG && idUsuario !== petData.ong?.usuario.idUsuario) {
          show = false;
          push("/");
        }

        if (show) {
          setPet(petData);
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchPetAndOngDetails();
  }, [params.idPet, params.idOng]);

  useEffect(() => {
    const photos = converterImagensParaFiles(pet)
    setPhotos(photos)
  }, [pet]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Navbar />
        {error &&
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Pet não encontrado!</h1>
              <p className="text-gray-600">Desculpe, o pet que você está procurando não foi encontrado.</p>
            </div>
          </div>}
        {pet &&
          (telaAtual === 'visualizar' && (
            <VisualizarPet setTelaAtual={setTelaAtual} pet={pet} photos={photos} setPhotos={setPhotos} />
          ))}
        {telaAtual === 'editar' && (
          <AlterarPet onClickVoltar={() => setTelaAtual('visualizar')} pet={pet} photos={photos} setPhotos={setPhotos} />
        )}
      </div>
      <Footer />
    </div>
  );
}

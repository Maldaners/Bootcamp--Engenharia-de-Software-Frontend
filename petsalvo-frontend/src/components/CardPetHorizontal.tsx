import React, { useState, useEffect } from 'react';
import { PiGenderMale, PiGenderFemale } from 'react-icons/pi'
import { FaHeart, FaCalendar, FaCheckCircle, FaExclamationCircle, FaIdCard } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import Image from 'next/image'
import BotaoPrimario from './BotaoPrimario';
import { StatusAdocaoAdotanteEnum } from '@/contexts/StatusAdocaoAdotanteEnum';
import { useRouter } from 'next/navigation';
import { TipoUsuarioEnum } from '@/contexts/TipoUsuarioEnum';
import { getTipoUsuario } from '@/contexts/UserContext';
import { converterFormatoDataAnoMesDia } from '@/utils/dataUtils';
import { converterImagensParaFiles } from '@/utils/imagemUtils';

export default function CardPetHorizontal(props: any) {
    const { push } = useRouter();
    const [tipoUsuario, setTipoUsuario] = useState<TipoUsuarioEnum | null>(null);
    const pet = props.pet
    const [photos, setPhotos] = useState<string[]>([]);
    //Data vem no formato 2024-01-15 yyyy/mm/dd
    const ultimaSolicitacao = pet.data ? converterFormatoDataAnoMesDia(pet.data) : ""

    useEffect(() => {
        setTipoUsuario(getTipoUsuario());
    }, []);

    useEffect(() => {
        const photos = converterImagensParaFiles(pet)
        setPhotos(photos)
    }, [pet]);

    return (
        <>
            <div
                key={pet.key}
                className="rounded border border-black shadow-md shadow-black/25 hover:cursor-pointer flex mt-10"
            >
                <div className="flex justify-center items-center relative h-52 md:h-60 border w-3/12">
                    <Image
                        src={
                            photos.length >= 1
                                ? photos[0]
                                : pet.tipo === 1
                                    ? '/dog-card.svg'
                                    : '/cat-card.svg'
                        }
                        layout="fill"
                        alt="Picture of the dog"
                        className="w-full object-cover"
                    />
                </div>
                <div className="flex w-full flex-col p-6 gap-2">
                    <div className="flex justify-between gap-2">
                        <p className="text-sm sm:text-base 2xl:text-lg truncate hover:break-normal">
                            {pet.nome}, {pet.idade}
                            {pet.idade === 1
                                ? ' ano'
                                : ' anos'}
                        </p>
                        {pet.sexo.toUpperCase() === 'M' ? (
                            <PiGenderMale className="text-base md:text-xl" />
                        ) : (
                            <PiGenderFemale className="text-base text- md:text-xl text-amber-600" />
                        )}
                    </div>

                    {
                        tipoUsuario == TipoUsuarioEnum.ONG ?
                            <div>
                                <div className="flex items-center gap-1">
                                    <FaHeart className="text-pink-600" />Quantidade de matches: {pet.quantidadeMatches}</div>
                                <div className="flex items-center gap-1">
                                    <IoPeople />Candidatos em análise: {pet.quantidade}</div>
                                <div className="flex items-center gap-1">
                                    <FaCalendar />Última solicitação: {ultimaSolicitacao}</div>
                            </div>
                            :
                            <div>
                                <div className="flex items-center gap-1">
                                    <FaHeart className="text-pink-600" />ONG: {pet.ong}</div>
                                <div className="flex items-center gap-1">
                                    {pet.status === 3 || pet.status === 5 || pet.status === 6 || pet.status === 7 ? (
                                        <FaExclamationCircle className="text-red-600" />
                                    ) : (
                                        <FaCheckCircle className="text-green-600" />
                                    )}
                                    Status do processo: {StatusAdocaoAdotanteEnum[pet.status]}
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaIdCard className="text-pink-600" />ID do Processo: Processo #{pet.idProcessoAdocao}
                                </div>
                            </div>
                    }

                    <div className='flex w-30 justify-end mt-auto'>
                        {
                            tipoUsuario == TipoUsuarioEnum.ONG ? <BotaoPrimario text="Ver detalhes" onClick={() => push(`/candidates-list/${pet.idPet}`)} />
                                : <BotaoPrimario text="Ver detalhes" onClick={() => push(`/pet/${pet.idPet}/ong/${pet.idOng}`)} />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
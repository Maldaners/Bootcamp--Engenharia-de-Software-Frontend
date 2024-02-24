import React, { useState } from 'react';
import Image from 'next/image';
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"

interface VisualizadorFotoPetProps {
    photos: string[];
    exibirFoto: boolean;
    tipo: number | undefined;
}

const VisualizadorFotoPet: React.FC<VisualizadorFotoPetProps> = ({ photos, exibirFoto, tipo }) => {
    const [indexFotoAtual, setIndexFotoAtual] = useState(0);

    const onClickAnterior = () => {
        if (indexFotoAtual > 0) {
            setIndexFotoAtual(indexFotoAtual - 1);
        }
    };

    const onClickProximo = () => {
        if (indexFotoAtual < photos.length - 1) {
            setIndexFotoAtual(indexFotoAtual + 1);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row items-center justify-between w-full">
                <button onClick={onClickAnterior} disabled={indexFotoAtual === 0} className="bg-purple-variant border border-black rounded-full w-10 h-10 flex items-center justify-center">
                    <AiOutlineLeft />
                </button>
                {photos.length > 0 ? (
                    <div className="relative w-72 h-64">
                        <Image
                            src={photos[indexFotoAtual]}
                            alt="foto do pet"
                            layout="fill"
                            objectFit="cover"
                            className="border-black rounded-lg"
                            loading="lazy"
                            key={indexFotoAtual}
                        />
                    </div>
                ) : (
                    <div className="relative w-72 h-64">
                        {exibirFoto &&
                            <Image
                                src={tipo === 1 ? "/dog-card.svg" : "/cat-card.svg"}
                                alt="nenhuma foto disponivel"
                                layout="fill"
                                objectFit="cover"
                                className="border-black rounded-lg"
                                loading="lazy"
                            />
                        }
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-black text-xl font-bold">Nenhuma foto disponível</p>
                        </div>
                    </div>
                )}
                <button onClick={onClickProximo} disabled={indexFotoAtual === photos.length - 1} className="bg-purple-variant border border-black rounded-full w-10 h-10 flex items-center justify-center">
                    <AiOutlineRight />
                </button>
            </div>
            <div className="flex justify-center mt-2">
                {photos.map((photo, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 mx-1 rounded-full border border-black ${index === indexFotoAtual ? 'bg-main' : 'bg-white'}`}
                        onClick={() => setIndexFotoAtual(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default VisualizadorFotoPet;

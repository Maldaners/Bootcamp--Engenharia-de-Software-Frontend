"use client"
import Ong from '@/model/Ong';
import React from 'react';
import { PiMapPinLight, PiPhoneBold, PiDiamondsFourFill } from 'react-icons/pi'

interface CardOngProps {
    ongData: Ong,
}

const CardOng = (props: CardOngProps) => {
    const { ongData } = props;


    return (
        <div className="flex flex-col lg:w-[32rem] lg:h-[11.75rem] lg:max-w-[32rem] lg:min-h-[12.75rem] lg:max-h-[11.75rem] border border-black overflow-hidden shadow-lg shadow-black/25 p-5 gap-4 rounded">
            <p className='text-2xl font-medium'>{ongData.usuario.nome}</p>
            <div className='flex flex-col lg:flex-row h-full'>
                <section className='flex-2 flex flex-col gap-2 text-sm'>
                    <p className='flex items-center gap-2 font-medium'><PiPhoneBold /> <span className='max-w-[280px]'>{ongData.usuario.telefone}</span></p>
                    <p className='flex items-center gap-2 font-medium'><PiMapPinLight /> <span className='max-w-[280px]'>{`${ongData.endereco.rua}, ${ongData.endereco.numero} - ${ongData.endereco.cidade}`}</span></p>
                    <p className='flex items-center gap-2 font-medium'>
                        <PiDiamondsFourFill className="self-start min-w-4"/>
                        <div className='flex-col'>
                            {ongData.pix?.map((pix, index) => (
                                <span  key={index} className='flex flex-wrap gap-1 overflow-y-auto max-h-[59px] max-w-[280px] break-all'>{pix.chave}</span>
                            )) 
                            }          
                        </div>
                    </p>
                </section>
                <div className="h-30 mx-2 w-[1px] bg-black" />
                <section className='flex-1 mt-2 lg:mt-0'>
                    <p className='font-medium'>status:</p>
                    <div className='flex flex-wrap gap-1 overflow-auto max-h-[4.688rem]'>{ongData.status.map(item => <div key={item.nome} className="rounded-full bg-red-500 text-white text-sm px-1 border border-black">{item.nome}</div>)}</div>
                </section>
            </div>
        </div>
    );
};

export default CardOng;
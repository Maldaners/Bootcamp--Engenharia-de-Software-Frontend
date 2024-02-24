"use client";
import React,{useState} from 'react';
import { useRouter } from 'next/navigation';
import CadastroOng from '@/components/cadastro/CadastroOng';

const RegistrarOng = () => {

    const { push } = useRouter();
    const [photo, setPhoto] = useState<string | null>(null);

    return (
        <>
            <CadastroOng onClickVoltar={() => push('/')} ongCadastrada={null} bloquearEdicao={false} photo={photo} setPhoto={setPhoto}/>
        </>
    );
}

export default RegistrarOng
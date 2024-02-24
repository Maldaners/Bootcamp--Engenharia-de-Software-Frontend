"use client";
import React,{useState} from 'react';
import { useRouter } from 'next/navigation';
import CadastroAdotante from '@/components/cadastro/CadastroAdotante';

const RegistrarAdotante = () => {

    const { push } = useRouter();
    const [photo, setPhoto] = useState<string | null>(null);

    return (
        <>
            <CadastroAdotante onClickVoltar={() => push('/')} adotanteCadastrado={null} bloquearEdicao={false} photo={photo} setPhoto={setPhoto}/>
        </>
    );
}

export default RegistrarAdotante
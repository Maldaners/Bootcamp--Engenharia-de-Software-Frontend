'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AlterarPet from '@/components/pet/AlterarPet';
import Footer from '@/components/Footer';
import { TipoUsuarioEnum } from '@/contexts/TipoUsuarioEnum';
import { getTipoUsuario } from '@/contexts/UserContext';

const PetRegister = () => {

    const { push } = useRouter();
    const [show, setShow] = useState<boolean>(false);
    const [photos, setPhotos] = useState<string[]>([]);

    useEffect(() => {
        const tipoUsuario = getTipoUsuario();
        if (tipoUsuario === TipoUsuarioEnum.ONG) {
            setShow(true);
        } else {
            push("/");
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1">
                <Navbar />
                {show &&
                    <AlterarPet onClickVoltar={() => push('/')} pet={null} photos={photos}  setPhotos={setPhotos}/>
                }
            </div>
            <Footer />
        </div>
    );
}

export default PetRegister
"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CadastroAdotante from "@/components/cadastro/CadastroAdotante";
import { useRouter } from 'next/navigation';
import CadastroOng from "@/components/cadastro/CadastroOng";
import Adotante from "@/model/Adotante";
import Ong from "@/model/Ong";
import { registerService } from "@/services/register.service";
import Footer from "@/components/Footer";
import { TipoUsuarioEnum } from '@/contexts/TipoUsuarioEnum';
import { getTipoUsuario } from '@/contexts/UserContext';

const Profile = () => {

    const [adotante, setAdotante] = useState<Adotante | null>(null);
    const [ong, setOng] = useState<Ong | null>(null);
    const { push } = useRouter();
    const [error, setError] = useState<string>('');
    const [photo, setPhoto] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const tipoUsuario = getTipoUsuario();
            try {
                if (tipoUsuario === TipoUsuarioEnum.ONG) {
                    const o: Ong = await registerService.getOng();
                    setOng(o);

                    if (o.usuario.imagem?.url) {
                        const url = o.usuario.imagem.url;
                        const adjustedUrl = `http://localhost:8080/${url.replace(/\\/g, "/")}`;
                        setPhoto(adjustedUrl);
                    }
                } else if (tipoUsuario === TipoUsuarioEnum.ADOTANTE) {
                    const a: Adotante = await registerService.getAdotante();
                    setAdotante(a);

                    if (a.usuario.imagem?.url) {
                        const url = a.usuario.imagem.url;
                        const adjustedUrl = `http://localhost:8080/${url.replace(/\\/g, "/")}`;
                        setPhoto(adjustedUrl);
                    }
                } else {
                    push("/");
                }
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1">
                <Navbar />
                {error &&
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">Erro ao buscar o usuário</h1>
                        </div>
                    </div>}
                {adotante && <CadastroAdotante onClickVoltar={() => push('/')} adotanteCadastrado={adotante} bloquearEdicao={true} photo={photo} setPhoto={setPhoto} />}
                {ong && <CadastroOng onClickVoltar={() => push('/')} ongCadastrada={ong} bloquearEdicao={true} photo={photo} setPhoto={setPhoto} />}
            </div>
            <Footer />
        </div>
    )
}

export default Profile
"use client";
import FormularioEsqueciSenha from "@/components/login/FormularioEsqueciSenha";
import FormularioLogin from "@/components/login/FormularioLogin";
import FormularioPerfil from "@/components/login/FormularioPerfil";
import Image from 'next/image';
import { useState } from "react";

const Login = () => {
    const [telaAtual, setTelaAtual] = useState<'login' | 'perfil' | 'esqueci-senha'>('login');

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
            <div className="hidden sm:block relative">
                <Image
                    className="w-screen h-screen object-cover"
                    src="/login.jpg"
                    alt="foto de um cachorro"
                    fill
                />
            </div>

            <div className="bg-white flex flex-col justify-center gap-4">
                <Image src="/logo-black.svg" width={200} height={200} alt="logo pet salvo" className="mx-auto rounded-2xl" />
                <h1 className="text-xl text-black font-bold text-center">Faça seu login</h1>
                <h2 className="text-base text-black text-center">Para divulgar ou adotar um animalzinho, você precisa ter um cadastro</h2>

                {telaAtual === 'login' &&
                    <FormularioLogin setTelaAtual={setTelaAtual} />
                }
                {telaAtual === 'perfil' &&
                    <FormularioPerfil setTelaAtual={setTelaAtual} />
                }
                {telaAtual === 'esqueci-senha' &&
                    <FormularioEsqueciSenha setTelaAtual={setTelaAtual} />
                }
            </div>
        </div >
    );
}

export default Login
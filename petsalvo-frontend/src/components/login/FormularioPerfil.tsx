import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import Radio from "./Radio";
import Link from "./Link";
import BotaoSecundario from "../BotaoSecundario";

interface LoginProps {
    setTelaAtual: React.Dispatch<React.SetStateAction<'login' | 'perfil' | 'esqueci-senha'>>;
}

const schema = z.object({
    perfil: z.enum(['adotante', 'ong'], {
        errorMap: () => { return { message: "Selecione um tipo de perfil" } }
    })
})

type FormData = z.infer<typeof schema>;

const FormularioPerfil: React.FC<LoginProps> = ({ setTelaAtual }) => {

    const { push } = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        reValidateMode: "onBlur",
        resolver: zodResolver(schema)
    });

    const submitData = (data: FormData) => {
        const perfil = data.perfil;
        if(perfil === 'adotante'){
            push('/cadastro/adotante');
        }else{
            push('/cadastro/ong');
        }
    }

    return (
        <form onSubmit={handleSubmit(submitData)} className="max-w-[400px] min-h-[400px] w-full flex flex-col gap-5 mx-auto bg-background border border-black p-8 px-8 rounded-lg">
            <div className="flex flex-col gap-5 flex-grow">
                <h2 id="cadastro" className="text-3xl text-black font-bold text-center">Cadastro</h2>
                <h2 id="qual_e_seu_perfil" className="text-lg text-black font-semi-bold text-center">Qual é seu perfil?</h2>
                <Radio
                    {...register("perfil")}
                    id="adotante"
                    text="Quero adotar um Pet"
                    name="perfil"
                    value="adotante"
                    error={!!errors.perfil?.message}
                />
                <Radio
                    {...register("perfil")}
                    id="ong"
                    text="Sou uma ONG de Pets"
                    name="perfil"
                    value="ong"
                    error={!!errors.perfil?.message}
                />
                {!!errors.perfil?.message && <span className="text-error text-sm">{errors.perfil?.message}</span>}
            </div>
            <BotaoSecundario
                id="confirmar"
                text="Confirmar"
                type="submit"
            />
            <Link
                id="ja_tenho_cadastro"
                text="Já tenho cadastro"
                center={true}
                onClick={() => setTelaAtual("login")}
            />
        </form>
    );
}

export default FormularioPerfil
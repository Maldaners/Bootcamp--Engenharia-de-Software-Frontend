import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BotaoPrimario from "../BotaoPrimario";
import Input from "./Input";
import InputSenha from "./InputSenha";
import Link from "./Link";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import { useRouter } from 'next/navigation';

interface LoginProps {
    setTelaAtual: React.Dispatch<React.SetStateAction<'login' | 'perfil' | 'esqueci-senha'>>;
}

const schema = z.object({
    email: z.string().min(1, "campo E-mail é obrigatório").email("E-mail inválido"),
    senha: z.string().min(1, "campo Senha é obrigatório")
})

type FormData = z.infer<typeof schema>;

const FormularioLogin: React.FC<LoginProps> = ({ setTelaAtual }) => {

    const [erroLogin, setErroLogin] = useState<string | null>(null);
    const { signIn } = useAuth();
    const { push } = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        reValidateMode: "onBlur",
        resolver: zodResolver(schema)
    });

    const submitData = async (data: FormData) => {
        try {
            const { accessToken } = await authService.login(data.email, data.senha);
            signIn(accessToken);
            push('/');
        } catch (error: any) {
            setErroLogin(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit(submitData)} className="max-w-[400px] min-h-[400px] w-full flex flex-col gap-5 mx-auto bg-background border border-black p-8 px-8 rounded-lg">
            <div className="flex flex-col gap-5 flex-grow">
                <h2 id="login" className="text-3xl text-black font-bold text-center">Login</h2>
                <Input
                    {...register("email")}
                    id="email"
                    placeholder="E-mail"
                    type="text"
                    helperText={errors.email?.message}
                    error={!!errors.email?.message}
                    onBlur={() => setErroLogin(null)}
                />
                <InputSenha
                    {...register("senha")}
                    id="senha"
                    placeholder="Senha"
                    type="password"
                    helperText={errors.senha?.message}
                    error={!!errors.senha?.message}
                    onBlur={() => setErroLogin(null)}
                />
                {/* Funcionalidade de esqueci a senha não será implementada no MVP
                <Link
                    id="link_esqueci_a_senha"
                    text="Esqueci a senha"
                    center={false}
                    onClick={() => setTelaAtual("esqueci-senha")}
                />
                 */}
            </div>
            {erroLogin && <span className="text-error text-sm">{erroLogin}</span>} {/* Exibe a mensagem de erro se houver */}
            <BotaoPrimario
                id="entrar"
                text="Entrar"
                type="submit"
            />
            <Link
                id="cadastre_se"
                text="Cadastre-se"
                center={true}
                onClick={() => setTelaAtual("perfil")}
            />
        </form>
    );
}

export default FormularioLogin
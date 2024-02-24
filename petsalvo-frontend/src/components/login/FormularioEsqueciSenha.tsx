import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import Link from "./Link";
import BotaoSecundario from "../BotaoSecundario";

interface LoginProps {
    setTelaAtual: React.Dispatch<React.SetStateAction<'login' | 'perfil' | 'esqueci-senha'>>;
}

const schema = z.object({
    email: z.string().min(1, "campo E-mail é obrigatório").email("E-mail inválido")
})

type FormData = z.infer<typeof schema>;

const FormularioEsqueciSenha: React.FC<LoginProps> = ({ setTelaAtual }) => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        reValidateMode: "onBlur",
        resolver: zodResolver(schema)
    });

    const submitData = (data: FormData) => {
        const email = data.email;
        alert("E-mail de recuperação enviado: " + email);
    }

    return (
        <form onSubmit={handleSubmit(submitData)} className="max-w-[400px] min-h-[400px] w-full flex flex-col gap-5 mx-auto bg-background border border-black p-8 px-8 rounded-lg">
            <div className="flex flex-col gap-5 flex-grow">
                <h2 id="esqueci_a_senha" className="text-3xl text-black font-bold text-center">Esqueci a senha</h2>
                <Input
                    {...register("email")}
                    id="email_esqueci_a_senha"
                    placeholder="E-mail"
                    type="text"
                    helperText={errors.email?.message}
                    error={!!errors.email?.message}
                />
            </div>
            <BotaoSecundario
                id="recuperar"
                text="Recuperar"
                type="submit"
            />
            <Link
                id="voltar"
                text="Voltar"
                center={true}
                onClick={() => setTelaAtual("login")}
            />
        </form>
    );
}

export default FormularioEsqueciSenha
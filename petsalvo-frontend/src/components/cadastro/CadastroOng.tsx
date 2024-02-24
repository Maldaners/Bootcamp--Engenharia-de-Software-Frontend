"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import Input from "@/components/Input";
import CheckBox from "@/components/CheckBox";
import BotaoVoltar from "@/components/BotaoVoltar";
import BotaoPrimario from "@/components/BotaoPrimario";
import Upload from "@/components/Upload";
import Select from '@/components/Select';
import { registerService } from "@/services/register.service";
import { ibgeService } from '@/services/ibge.service';
import Ong from '@/model/Ong';
import Endereco from '@/model/Endereco';
import Usuario from '@/model/Usuario';
import Popup from '@/components/Popup';
import StatusOng from '@/components/cadastro/StatusOng';
import PixOng from '@/components/cadastro/PixOng';
import Pix from '@/model/Pix';
import Status from '@/model/Status';
import { authService } from '@/services/auth.service';

const schema = z.object({
    nome: z.string().refine(value => value.trim().length > 0, "Campo Nome Completo é obrigatório"),
    telefone: z.string()
        .refine(value => /^\(\d{2}\) \d{5}-\d{4}$/.test(value), {
            message: 'Campo Telefone é obrigatório',
        }),
    site: z.string().optional().refine((value) => {
        if (!value) return true;
        const validWithoutProtocol = /^www\.[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return validWithoutProtocol.test(value);
    }, {
        message: 'Site inválido',
    }),
    cnpj: z.string()
        .refine(value => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value), {
            message: 'Campo CNPJ é obrigatório',
        })
        .transform(value => value.replace(/[^0-9]/g, '')),
    email: z.string().min(1, "Campo E-mail é obrigatório").email("E-mail inválido"),
    senha: z.string().refine(value => value.length > 0, "Campo Senha é obrigatório").refine(value => !/\s/.test(value), "A senha não pode conter espaços em branco"),
    confirmarSenha: z.string().refine(value => value.length > 0, "Campo Confirmar senha é obrigatório").refine(value => !/\s/.test(value), "A senha não pode conter espaços em branco"),
    cep: z.string()
        .refine(value => /^\d{5}-\d{3}$/.test(value), {
            message: 'Campo CEP é obrigatório',
        })
        .transform(value => value.replace(/[^0-9]/g, '')),
    endereco: z.string().refine(value => value.trim().length > 0, "Campo Endereço é obrigatório"),
    bairro: z.string().refine(value => value.trim().length > 0, "Campo Bairro é obrigatório"),
    numero: z.string().refine(value => /^\d+$/.test(value), {
        message: 'Campo Número é obrigatório e deve conter apenas dígitos',
    }).transform(value => Number(value)),
    complemento: z.string().optional(),
    cidade: z.string().refine(value => value !== "0", {
        message: 'Campo Cidade é obrigatório',
    }),
    estado: z.string().refine(value => value !== "0", {
        message: 'Campo Estado é obrigatório',
    }),
    liOsTermosDeUsoEConcordo: z.boolean().refine(value => value === true, {
        message: 'Li os termos de uso e concordo é obrigatório',
    }),
}).refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"]
})

type FormData = z.infer<typeof schema>;

interface CadastroOngProps {
    onClickVoltar: () => void;
    ongCadastrada: Ong | null;
    bloquearEdicao: boolean;
    photo: string | null;
    setPhoto: React.Dispatch<React.SetStateAction<string | null>>;
}

const CadastroOng: React.FC<CadastroOngProps> = ({ onClickVoltar, ongCadastrada, bloquearEdicao,photo, setPhoto }) => {

    const [exibirPopup, setExibirPopup] = useState(false);
    const [selectedItemsListStatus, setSelectedItemsListStatus] = useState<string[]>(
        ongCadastrada?.status.map((status: Status) => status.nome) || []
    );

    const [selectedItemsListPix, setSelectedItemsListPix] = useState<Pix[]>(ongCadastrada?.pix || []);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [photoFile, setPhotoFile] = useState<File>();

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
            const usuario: Usuario = {
                email: data.email,
                senha: data.senha,
                nome: data.nome,
                telefone: data.telefone,
                termos: true,
            };

            const endereco: Endereco = {
                cep: data.cep,
                rua: data.endereco,
                bairro: data.bairro,
                numero: data.numero,
                cidade: data.cidade,
                estado: data.estado,
                complemento: data.complemento && data.complemento.trim().length > 0 ? data.complemento : "",
            };

            const ong: Ong = {
                usuario,
                site: data.site || "",
                cnpj: data.cnpj,
                endereco: endereco,
                pix: selectedItemsListPix,
                status: selectedItemsListStatus.map((nome) => ({ nome }))
            };
            await registerService.registerOng(ong);

            if (photoFile) {
                const { accessToken } = await authService.login(data.email, data.senha);
                await registerService.registerOngImage(photoFile,accessToken);
            }

            setError(false);
            setErrorMessage("");
        } catch (error: any) {
            setError(true);
            setErrorMessage(error.message);
        }
        setExibirPopup(true);
    }

    type IBGEUFResponse = {
        id: number;
        sigla: string;
        nome: string;
    }

    type IBGECITYResponse = {
        id: number;
        nome: string;
    }

    const [ufs, setUfs] = useState<IBGEUFResponse[]>([]);
    const [cities, setCities] = useState<IBGECITYResponse[]>([]);
    const [selectedUf, setSelectedUf] = useState(ongCadastrada ? ongCadastrada.endereco.estado : "0");
    const [selectedCity, setSelectedCity] = useState(ongCadastrada ? ongCadastrada.endereco.cidade : "0");

    useEffect(() => {
        ibgeService.getStates()
            .then((response: any) => {
                setUfs(response);
            })
            .catch((error: any) => {
                console.error('Erro ao buscar estados:', error);
            });
    }, []);

    useEffect(() => {
        if (selectedUf !== "0") {
            ibgeService.getCities(selectedUf)
                .then((response: any) => {
                    setCities(response);
                })
                .catch((error: any) => {
                    console.error('Erro ao buscar cidades:', error);
                });
        }
    }, [selectedUf]);

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    }

    return (
        <>
            {ongCadastrada === null && <nav className="bg-main px-2 py-2 flex">
                <BotaoVoltar id="voltar" text="Voltar" onClick={onClickVoltar} />
            </nav>}

            <div className="bg-background">
                <Upload bloquearEdicao={bloquearEdicao} photo={photo} setPhoto={setPhoto} setPhotoFile={setPhotoFile} />
                <div className="flex justify-center">
                    <form onSubmit={handleSubmit(submitData)} method="post" className="md:w-1/2 w-full m-4 p-8 border  border-black mb-8 rounded-lg gap-4 flex flex-col">
                        <h1 id="dadosDaOng" className="text-2xl font-semibold">Dados da ONG</h1>

                        <Input
                            {...register("nome")}
                            id="nome"
                            text="Nome Completo"
                            defaultValue={ongCadastrada?.usuario.nome}
                            disabled={bloquearEdicao}
                            helperText={errors.nome?.message}
                            error={!!errors.nome?.message}
                        />
                        <div className="flex gap-4" >
                            <div className="w-1/2">
                                <Input
                                    {...register("telefone")}
                                    id="telefone"
                                    text="Telefone"
                                    mask="(99) 99999-9999"
                                    placeholder="(00) 91234-5678"
                                    defaultValue={ongCadastrada?.usuario.telefone}
                                    disabled={bloquearEdicao}
                                    helperText={errors.telefone?.message}
                                    error={!!errors.telefone?.message}
                                />
                            </div>
                            <div className="w-1/2">
                                <Input
                                    {...register("site")}
                                    id="site"
                                    placeholder={ongCadastrada ? "" : "www.site.com"}
                                    text="Site (opcional)"
                                    defaultValue={ongCadastrada?.site}
                                    disabled={bloquearEdicao}
                                    helperText={errors.site?.message}
                                    error={!!errors.site?.message}
                                />
                            </div>
                        </div>
                        <Input
                            {...register("cnpj")}
                            id="cnpj"
                            text="CNPJ"
                            mask="99.999.999/9999-99"
                            placeholder="00.000.000/0000-00"
                            defaultValue={ongCadastrada?.cnpj}
                            disabled={bloquearEdicao}
                            helperText={errors.cnpj?.message}
                            error={!!errors.cnpj?.message}
                        />
                        <Input
                            {...register("email")}
                            id="email"
                            text="E-mail"
                            placeholder="email@email.com"
                            defaultValue={ongCadastrada?.usuario.email}
                            disabled={bloquearEdicao}
                            helperText={errors.email?.message}
                            error={!!errors.email?.message}
                        />
                        <Input
                            {...register("senha")}
                            id="senha"
                            text="Senha"
                            type="password"
                            defaultValue={ongCadastrada ? '***' : ''}
                            disabled={bloquearEdicao}
                            helperText={errors.senha?.message}
                            error={!!errors.senha?.message}
                        />
                        <Input
                            {...register("confirmarSenha")}
                            id="confirmarSenha"
                            text="Confirmar senha"
                            type="password"
                            defaultValue={ongCadastrada ? '***' : ''}
                            disabled={bloquearEdicao}
                            helperText={errors.confirmarSenha?.message}
                            error={!!errors.confirmarSenha?.message}
                        />
                        <h1 id="endereco" className="text-2xl font-semibold">Endereço</h1>
                        <div className="w-1/4">
                            <Input
                                {...register("cep")}
                                id="cep"
                                text="CEP"
                                mask="99999-999"
                                placeholder="12345-678"
                                defaultValue={ongCadastrada?.endereco.cep}
                                disabled={bloquearEdicao}
                                helperText={errors.cep?.message}
                                error={!!errors.cep?.message}
                            />
                        </div>
                        <Input
                            {...register("endereco")}
                            id="endereco"
                            text="Endereço"
                            defaultValue={ongCadastrada?.endereco.rua}
                            disabled={bloquearEdicao}
                            helperText={errors.endereco?.message}
                            error={!!errors.endereco?.message}
                        />
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Input
                                    {...register("bairro")}
                                    id="bairro"
                                    text="Bairro"
                                    defaultValue={ongCadastrada?.endereco.bairro}
                                    disabled={bloquearEdicao}
                                    helperText={errors.bairro?.message}
                                    error={!!errors.bairro?.message}
                                />
                            </div>
                            <div className="w-1/2">
                                <Input
                                    {...register("numero")}
                                    id="numero"
                                    text="Número"
                                    type="number"
                                    defaultValue={ongCadastrada?.endereco.numero}
                                    disabled={bloquearEdicao}
                                    helperText={errors.numero?.message}
                                    error={!!errors.numero?.message}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Select
                                    {...register("estado")}
                                    id="estado"
                                    text="Estado"
                                    onChange={handleSelectedUf}
                                    value={selectedUf}
                                    defaultValue={ongCadastrada?.endereco.estado}
                                    disabled={bloquearEdicao}
                                    options={ufs.map(uf => ({ key: uf.id, value: uf.sigla, text: uf.nome }))}
                                    helperText={errors.estado?.message}
                                    error={!!errors.estado?.message}
                                />
                            </div>
                            <div className="w-1/2">
                                <Select
                                    {...register("cidade")}
                                    id="cidade"
                                    text="Cidade"
                                    disabled={bloquearEdicao}
                                    defaultValue={ongCadastrada?.endereco.cidade}
                                    onChange={handleSelectedCity}
                                    value={selectedCity}
                                    options={cities.map(city => ({ key: city.id, value: city.nome, text: city.nome }))}
                                    helperText={errors.cidade?.message}
                                    error={!!errors.cidade?.message}
                                />
                            </div>
                        </div>
                        <Input
                            {...register("complemento")}
                            id="complemento"
                            text="Complemento (opcional)"
                            defaultValue={ongCadastrada?.endereco.complemento}
                            disabled={bloquearEdicao}
                            helperText={errors.complemento?.message}
                            error={!!errors.complemento?.message}
                        />

                        <h1 id="dadosStatus" className="text-2xl font-semibold">Status</h1>
                        {bloquearEdicao === false &&
                            <h2 id="escolhaStatus">Escolha os status que aparecerão em seu perfil (Máximo 5)</h2>
                        }

                        <div className="flex gap-4">
                            <div className="w-full">
                                <StatusOng
                                    selectedItemsList={selectedItemsListStatus}
                                    setSelectedItemsList={setSelectedItemsListStatus}
                                    bloquearEdicao={bloquearEdicao}
                                />
                            </div>
                        </div>

                        <h1 id="dadosBacarios" className="text-2xl font-semibold">Dados bancários</h1>

                        {bloquearEdicao === false &&
                            <h2 id="escolhaStatus">Escolha as chaves PIX (Máximo 5)</h2>
                        }
                        <div className="flex gap-4">
                            <div className="w-full">
                                <PixOng
                                    selectedItemsList={selectedItemsListPix}
                                    setSelectedItemsList={setSelectedItemsListPix}
                                    bloquearEdicao={bloquearEdicao}
                                />
                            </div>
                        </div>

                        <CheckBox
                            {...register("liOsTermosDeUsoEConcordo")}
                            id="liOsTermosDeUsoEConcordo"
                            text="Li os termos de uso e concordo"
                            defaultChecked={ongCadastrada ? true : false}
                            disabled={bloquearEdicao}
                            helperText={errors.liOsTermosDeUsoEConcordo?.message}
                            error={!!errors.liOsTermosDeUsoEConcordo?.message}
                        />
                        {ongCadastrada ? (
                            <BotaoPrimario text="Voltar" type="button" onClick={onClickVoltar} />
                        ) : (
                            <BotaoPrimario text="Salvar" type="submit" />
                        )}
                    </form>
                    <Popup isOpen={exibirPopup} onClose={error ? () => setExibirPopup(false) : () => push("/login")} type={error ? 'error' : 'success'} operation={'save'} message={error ? errorMessage : ""} />
                </div>
            </div>
        </>
    );
}

export default CadastroOng
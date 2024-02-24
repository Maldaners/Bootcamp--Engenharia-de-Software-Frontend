"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import Input from "@/components/Input";
import CheckBox from "@/components/CheckBox";
import BotaoVoltar from "@/components/BotaoVoltar";
import DropDownBotaoRegistro from "@/components/cadastro/DropDownBotaoRegistro";
import QuestionarioAdocao from "@/components/cadastro/QuestionarioAdocao";
import BotaoPrimario from "@/components/BotaoPrimario";
import Upload from "@/components/Upload";
import Select from '@/components/Select';
import { registerService } from "@/services/register.service";
import { ibgeService } from '@/services/ibge.service';
import Adotante from '@/model/Adotante';
import Endereco from '@/model/Endereco';
import Usuario from '@/model/Usuario';
import Popup from '@/components/Popup';
import { converterFormatoDataDiaMesAno, converterFormatoDataAnoMesDia } from '@/utils/dataUtils';
import { isValid, parse } from 'date-fns';
import Formulario from '@/model/Formulario';
import FormularioResposta from '@/model/FormularioResposta';
import FormularioRespostaSelecionada from '@/model/FormularioRespostaSelecionada';
import { adocaoService } from '@/services/adocao.service';
import { authService } from '@/services/auth.service';

const isValidDate = (value: string): boolean => {
    const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
    return isValid(parsedDate);
};

const schema = z.object({
    nome: z.string().refine(value => value.trim().length > 0, "Campo Nome Completo é obrigatório"),
    dataNascimento: z.string().refine(value => {
        return isValidDate(value);
    }, {
        message: 'Campo Data de Nascimento é obrigatório e deve ser uma data válida no formato DD/MM/AAAA',
    }),
    telefone: z.string()
        .refine(value => /^\(\d{2}\) \d{5}-\d{4}$/.test(value), {
            message: 'Campo Telefone é obrigatório',
        }),
    cpf: z.string()
        .refine(value => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value), {
            message: 'Campo CPF é obrigatório',
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
    })
}).refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"]
})

type FormData = z.infer<typeof schema>;

interface CadastroAdotanteProps {
    onClickVoltar: () => void;
    adotanteCadastrado: Adotante | null;
    bloquearEdicao: boolean;
    photo: string | null;
    setPhoto: React.Dispatch<React.SetStateAction<string | null>>;
}

const CadastroAdotante: React.FC<CadastroAdotanteProps> = ({ onClickVoltar, adotanteCadastrado, bloquearEdicao, photo, setPhoto }) => {

    const [exibirPopup, setExibirPopup] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formularioData, setFormularioData] = useState<Formulario | null>(null);
    const [errorFormulario, setErrorFormulario] = useState(false);
    const [errorMessageFormulario, setErrorMessageFormulario] = useState("");
    const [listaRespostasSelecionadas, setListaRespostasSelecionadas] = useState<FormularioResposta[]>([]);
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

            const listaRespostas: FormularioRespostaSelecionada[] = listaRespostasSelecionadas.map(
                (respostaSelecionada) => ({
                    idFormularioResposta: respostaSelecionada.idFormularioResposta,
                })
            );

            const adotante: Adotante = {
                usuario,
                dataNasc: converterFormatoDataDiaMesAno(data.dataNascimento),
                cpf: data.cpf,
                endereco: endereco
            };

            if (listaRespostas.length > 0) {
                adotante.formulario = listaRespostas;
            }

            await registerService.registerAdotante(adotante);

            if (photoFile) {
                const { accessToken } = await authService.login(data.email, data.senha);
                await registerService.registerAdotanteImage(photoFile, accessToken);
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
    const [selectedUf, setSelectedUf] = useState(adotanteCadastrado ? adotanteCadastrado.endereco.estado : "0");
    const [selectedCity, setSelectedCity] = useState(adotanteCadastrado ? adotanteCadastrado.endereco.cidade : "0");

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

    useEffect(() => {
        const fetchFormulario = async () => {
            try {
                const formData = await registerService.getFormulario();

                try {
                    if (adotanteCadastrado) {
                        await adocaoService.getRespostasAdotante().then(res => {
                            res.forEach(resposta => {
                                if (formData) {
                                    formData.formularioPergunta.forEach(pergunta => {
                                        pergunta.formularioResposta.forEach(item => {
                                            if (item.idFormularioResposta == resposta.idFormularioResposta)
                                                pergunta.idFormularioResposta = item.idFormularioResposta
                                        })
                                    })
                                }
                            });
                        })
                    }
                } catch (error: any) {
                    if (error.message !== 'FORMULARIO_ADOTANTE_NAO_ENCONTRADO') {
                        throw new Error(error.message);
                    }
                }

                setFormularioData(formData);
                setErrorFormulario(false);
                setErrorMessageFormulario("");

            } catch (error: any) {
                setErrorFormulario(true);
                setErrorMessageFormulario(error.message);
            }
        };

        fetchFormulario();
    }, []);


    const handleOptionSelected = (perguntaId: number, respostaId: number) => {
        let newForm = formularioData;
        newForm?.formularioPergunta.forEach(resposta => {
            if (resposta.idFormularioPergunta == perguntaId)
                resposta.idFormularioResposta = respostaId
        })
        const updatedRespostas = listaRespostasSelecionadas.map((resposta) => {
            if (resposta.idFormularioPergunta === perguntaId) {
                return { ...resposta, idFormularioResposta: respostaId };
            }
            return resposta;
        });

        if (!updatedRespostas.some((resposta) => resposta.idFormularioPergunta === perguntaId)) {
            updatedRespostas.push({
                idFormularioResposta: respostaId,
                texto: '',
                idFormularioPergunta: perguntaId,
            });
        }
        setFormularioData(newForm);
        setListaRespostasSelecionadas(updatedRespostas);
    };

    return (
        <>
            {adotanteCadastrado === null && <nav className="bg-main px-2 py-2 flex">
                <BotaoVoltar id="voltar" text="Voltar" onClick={onClickVoltar} />
            </nav>}
            <div className="bg-background">
                <Upload bloquearEdicao={bloquearEdicao} photo={photo} setPhoto={setPhoto} setPhotoFile={setPhotoFile} />
                <div className="flex justify-center">
                    <form onSubmit={handleSubmit(submitData)} method="post" className="md:w-1/2 w-full m-4 p-8 border  border-black mb-8 rounded-lg gap-4 flex flex-col">
                        <h1 id="dadosPessoais" className="text-2xl font-semibold">Dados pessoais</h1>
                        <Input
                            {...register("nome")}
                            id="nome"
                            text="Nome Completo"
                            defaultValue={adotanteCadastrado?.usuario.nome}
                            disabled={bloquearEdicao}
                            helperText={errors.nome?.message}
                            error={!!errors.nome?.message}
                        />
                        <div className="flex gap-4" >
                            <div className="w-1/2">
                                <Input
                                    {...register("dataNascimento")}
                                    id="dataNascimento"
                                    text="Data de Nascimento"
                                    mask="99/99/9999"
                                    placeholder="DD/MM/AAAA"
                                    defaultValue={adotanteCadastrado ? converterFormatoDataAnoMesDia(adotanteCadastrado.dataNasc) : ''}
                                    disabled={bloquearEdicao}
                                    helperText={errors.dataNascimento?.message}
                                    error={!!errors.dataNascimento?.message}
                                />

                            </div>
                            <div className="w-1/2">
                                <Input
                                    {...register("telefone")}
                                    id="telefone"
                                    text="Telefone"
                                    mask="(99) 99999-9999"
                                    placeholder="(00) 91234-5678"
                                    defaultValue={adotanteCadastrado?.usuario.telefone}
                                    disabled={bloquearEdicao}
                                    helperText={errors.telefone?.message}
                                    error={!!errors.telefone?.message}
                                />
                            </div>
                        </div>
                        <Input
                            {...register("cpf")}
                            id="cpf"
                            text="CPF"
                            mask="999.999.999-99"
                            placeholder="000.000.000-00"
                            defaultValue={adotanteCadastrado?.cpf}
                            disabled={bloquearEdicao}
                            helperText={errors.cpf?.message}
                            error={!!errors.cpf?.message}
                        />

                        <Input
                            {...register("email")}
                            id="email"
                            text="E-mail"
                            placeholder="email@email.com"
                            defaultValue={adotanteCadastrado?.usuario.email}
                            disabled={bloquearEdicao}
                            helperText={errors.email?.message}
                            error={!!errors.email?.message}
                        />
                        <Input
                            {...register("senha")}
                            id="senha"
                            text="Senha"
                            type="password"
                            defaultValue={adotanteCadastrado ? '***' : ''}
                            disabled={bloquearEdicao}
                            helperText={errors.senha?.message}
                            error={!!errors.senha?.message}
                        />
                        <Input
                            {...register("confirmarSenha")}
                            id="confirmarSenha"
                            text="Confirmar senha"
                            type="password"
                            defaultValue={adotanteCadastrado ? '***' : ''}
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
                                defaultValue={adotanteCadastrado?.endereco.cep}
                                disabled={bloquearEdicao}
                                helperText={errors.cep?.message}
                                error={!!errors.cep?.message}
                            />
                        </div>
                        <Input
                            {...register("endereco")}
                            id="endereco"
                            text="Endereço"
                            defaultValue={adotanteCadastrado?.endereco.rua}
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
                                    defaultValue={adotanteCadastrado?.endereco.bairro}
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
                                    defaultValue={adotanteCadastrado?.endereco.numero}
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
                                    disabled={bloquearEdicao}
                                    value={selectedUf}
                                    onChange={handleSelectedUf}
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
                            defaultValue={adotanteCadastrado?.endereco.complemento}
                            disabled={bloquearEdicao}
                            helperText={errors.complemento?.message}
                            error={!!errors.complemento?.message}
                        />

                        {!errorFormulario && formularioData && (
                            <DropDownBotaoRegistro id="questionario" text="Questionario de adoção (opcional)">
                                <QuestionarioAdocao formData={formularioData} bloquearEdicao={adotanteCadastrado ? true : false} onOptionSelected={handleOptionSelected} />
                            </DropDownBotaoRegistro>
                        )}
                        {errorFormulario && (
                            <label className="text-red-500">{errorMessageFormulario}</label>
                        )}

                        <CheckBox
                            {...register("liOsTermosDeUsoEConcordo")}
                            id="liOsTermosDeUsoEConcordo"
                            text="Li os termos de uso e concordo"
                            defaultChecked={adotanteCadastrado ? true : false}
                            disabled={bloquearEdicao}
                            helperText={errors.liOsTermosDeUsoEConcordo?.message}
                            error={!!errors.liOsTermosDeUsoEConcordo?.message}
                        />
                        {adotanteCadastrado ? (
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

export default CadastroAdotante
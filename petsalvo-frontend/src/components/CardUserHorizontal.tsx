import { FaCheckCircle, FaExclamationCircle, FaIdCard } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import Image from 'next/image'
import BotaoPrimario from './BotaoPrimario';
import { StatusAdocaoOngEnum } from '@/contexts/StatusAdocaoOngEnum';
import { adocaoService } from "@/services/adocao.service";
import Modal from "./Modal";
import QuestionarioAdocao from "./cadastro/QuestionarioAdocao";
import BotaoTerciario from "./BotaoTerciario";
import { useEffect, useState } from "react";
import BotaoSecundario from "./BotaoSecundario";
import { useRouter } from 'next/navigation';
import { PiPhoneBold } from "react-icons/pi";
import Popup from "./Popup";

export default function CardUserHorizontal(props: any) {

    const [exibirModalFormulario, setExibirModalFormulario] = useState(false);
    const [exibirModalConfirmacao, setExibirModalConfirmacao] = useState(false);
    const [exibirPopup, setExibirPopup] = useState(false);
    const [textoModal, setTextoModal] = useState('')
    const [processo, setProcesso] = useState('')
    const [photos, setPhotos] = useState<string[]>([]);
    const [formulario, setFormulario] = useState(null);
    const { push } = useRouter();
    const user = props.user

    useEffect(() => {
        const usr = user.adotante.usuario
        if (usr?.imagem) {
            const adjustedUrl = `http://localhost:8080/${usr.imagem.url.replace(/\\/g, "/")}`;
            setPhotos([adjustedUrl])
        }
    }, [user]);


    const getFormulario = async () => {
        await adocaoService.getFormularioUsuario().then(async form => {
            await adocaoService.getFormularioONG(user.adotante.idUsuario).then(res => {
                res.forEach(resposta => {
                    if (form) {
                        form.formularioPergunta.forEach(pergunta => {
                            pergunta.formularioResposta.forEach(item => {
                                if (item.idFormularioResposta == resposta.idFormularioResposta)
                                    pergunta.idFormularioResposta = item.idFormularioResposta
                            })
                        })
                    }
                });
            })
            setFormulario(form)
        })
        setExibirModalFormulario(true)
    }

    const configModalConfirmacao = (tipoProcesso: string) => {
        setExibirModalConfirmacao(true)
        setProcesso(tipoProcesso)
    }

    const rejeitarAdocao = () => {
        adocaoService.mudaStatusAdocaoONG(user.idProcessoAdocao, 3).then((res) => {
            setTextoModal("Perfil Rejeitado!")
            if (res) setExibirPopup(true);
        })
    }

    const aprovarAdocao = () => {
        adocaoService.mudaStatusAdocaoONG(user.idProcessoAdocao, 2).then(res => {
            setTextoModal("Perfil Aprovado!")
            setExibirPopup(true);
        })
    }

    const finalizarAdocao = () => {
        adocaoService.mudaStatusAdocaoONG(user.idProcessoAdocao, 4).then((res) => {
            setTextoModal("Adoção Concluída!")
            if (res) setExibirPopup(true);
        })
    }

    const cancelarAdocao = () => {
        adocaoService.mudaStatusAdocaoONG(user.idProcessoAdocao, 7).then((res) => {
            setTextoModal("Processo de adoção cancelado!")
            if (res) setExibirPopup(true);
        })
    }

    return (
        <>
            <div
                key={user.key}
                className="rounded border border-black shadow-md shadow-black/25 hover:cursor-pointer flex mt-10"
            >
                <div className="flex justify-center items-center relative h-52 md:h-60 border w-3/12 ">
                    <Image
                        src={photos.length >= 1 ? photos[0] : "/User.svg"}
                        layout="fill"
                        alt="Picture of the user"
                        style={{ objectFit: "contain" }}
                        className="w-full object-cover"
                    />
                </div>
                <div className="flex w-full flex-col p-6 gap-2">
                    <div className="flex items-center  gap-1">
                        <IoPeople></IoPeople> <b>Nome: </b> {user.adotante.usuario.nome}
                    </div>
                    <div className="flex items-center  gap-1">
                        <PiPhoneBold /> <b>Telefone: </b> {user.adotante.usuario.telefone}
                    </div>

                    <div className='flex w-30 justify-between mt-auto'>
                        <div>
                            <div className="flex items-center gap-1">
                                {user.status === 3 || user.status === 5 || user.status === 6 || user.status === 7 ? (
                                    <FaExclamationCircle className="text-red-600" />
                                ) : (
                                    <FaCheckCircle className="text-green-600" />
                                )}
                                Status do processo: {StatusAdocaoOngEnum[user.status]}
                            </div>
                            <div className="flex items-center gap-1">
                                <FaIdCard className="text-pink-600" />ID do Processo: Processo #{user.idProcessoAdocao}
                            </div>
                        </div>
                        {
                            user.status == 1 ?
                                <BotaoPrimario text="Formulário" onClick={getFormulario} />
                                :
                                <>
                                    <BotaoTerciario onClick={() => configModalConfirmacao('cancelar')} text="Cancelar Adoção" />
                                    <BotaoPrimario onClick={() => configModalConfirmacao('finalizar')} text="Confirmar Adoção" />
                                </>
                        }
                    </div>
                </div>

                <Modal title="Formulário de adoção" isOpen={exibirModalFormulario} onClose={() => setExibirModalFormulario(false)}>
                    <QuestionarioAdocao formData={formulario}
                        onOptionSelected={function (perguntaId: number, respostaId: number): void { }} />
                    <div className="gap-4 flex flex-row justify-between mt-8">
                        <BotaoTerciario
                            id="cancelar"
                            text="Cancelar"
                            onClick={() => setExibirModalFormulario(false)}
                        />
                        <BotaoSecundario
                            id="rejeitar"
                            text="Rejeitar Perfil"
                            onClick={() => configModalConfirmacao('rejeitar')}
                        />
                        <BotaoPrimario
                            id="confirmar"
                            text="Aprovar Perfil"
                            onClick={() => configModalConfirmacao('aprovar')}
                        />
                    </div>
                </Modal>

                <Modal title="Confirmação" isOpen={exibirModalConfirmacao} onClose={() => {
                    setExibirModalConfirmacao(false)
                }}>
                    <>
                        Tem certeza que deseja {processo}?
                        <div className="gap-4 flex flex-row justify-between mt-8">
                            <BotaoTerciario
                                id="rejeitar"
                                text="Não"
                                onClick={() => setExibirModalConfirmacao(false)}
                            />
                            <BotaoPrimario
                                id="confirmar"
                                text="Sim"
                                onClick={() =>
                                    processo == 'aprovar' ? aprovarAdocao()
                                        : processo == 'finalizar' ? finalizarAdocao()
                                            : processo == 'cancelar' ? cancelarAdocao()
                                                : rejeitarAdocao()}
                            />
                        </div>
                    </>
                </Modal>

                <Popup isOpen={exibirPopup} onClose={() => push("/adoption-requests")} type={'success'} operation={'save'} message={textoModal} />

            </div>
        </>
    )
}
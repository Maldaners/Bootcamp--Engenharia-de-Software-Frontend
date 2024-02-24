import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BotaoVoltar from '@/components/BotaoVoltar';
import VisualizadorFotoPet from '@/components/pet/VisualizadorFotoPet';
import BotaoPrimario from '@/components/BotaoPrimario';
import BotaoTerciario from '@/components/BotaoTerciario'
import { GrLocation } from "react-icons/gr";
import Modal from '@/components/Modal';
import QuestionarioAdocao from '@/components/cadastro/QuestionarioAdocao';
import Pet from '@/model/Pet';
import { adocaoService } from '@/services/adocao.service';
import { TipoUsuarioEnum } from '@/contexts/TipoUsuarioEnum';
import FormularioResposta from '@/model/FormularioResposta';
import Formulario from '@/model/Formulario';
import FormularioPergunta from '@/model/FormularioPergunta';
import FormularioRespostaSelecionada from '@/model/FormularioRespostaSelecionada';
import { PiGenderFemale, PiGenderMale } from "react-icons/pi";
import { getTipoUsuario } from '@/contexts/UserContext';

interface VisualizarPetProps {
  setTelaAtual: React.Dispatch<React.SetStateAction<'visualizar' | 'editar'>>;
  pet: Pet | null;
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
}

const VisualizarPet: React.FC<VisualizarPetProps> = ({ setTelaAtual, pet, photos, setPhotos }) => {
  const router = useRouter();
  const { push } = router;
  const [exibirModalFormulario, setExibirModalFormulario] = useState(false);
  const [exibirModalSolicitacaoEnviada, setExibirModalSolicitacaoEnviada] = useState(false);
  const [exibirModalDesistencia, setExibirModalDesistencia] = useState(false);
  const [exibirModalDesistencia2, setExibirModalDesistencia2] = useState(false);
  const [idProcesso, setProcesso] = useState(null);
  const [formulario, setFormulario] = useState<Formulario | null>(null);
  const [listaRespostasSelecionadas, setListaRespostasSelecionadas] = useState<FormularioResposta[]>([]);
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuarioEnum | null>(null);
  const [exibirErroFormulario, setExibirErroFormulario] = useState<boolean>(false);
  const [mensagemErroFormulario, setMensagemErroFormulario] = useState<string>('');
  const [formularioSemRespostaAnteriores, setFormularioSemRespostaAnteriores] = useState<boolean>(false);
  const [statusProcesso, setStatusProcesso] = useState(null);

  useEffect(() => {
    setTipoUsuario(getTipoUsuario());
  }, []);

  useEffect(() => {
    adocaoService.getMatchesAdotante()
      .then((response: any) => {
        const item = response.find(item => item.idPet == pet?.idPet);
        if (item) {
          setProcesso(item.idProcessoAdocao);
          setStatusProcesso(item.status);
        }
      })
      .catch((error: any) => {
        console.error('Erro ao buscar matches:', error);
      });
  }, []);

  const onClickConfirmar = () => {
    const listaRespostas: FormularioRespostaSelecionada[] = listaRespostasSelecionadas.map(
      (respostaSelecionada) => ({
        idFormularioPergunta: respostaSelecionada.idFormularioPergunta,
        idFormularioResposta: respostaSelecionada.idFormularioResposta,
      }));

    if (listaRespostas.some(resposta => resposta.idFormularioResposta === undefined)) {
      setMensagemErroFormulario('É necessário responder todas as perguntas');
      setExibirErroFormulario(true);
    } else {
      setMensagemErroFormulario('');
      setExibirErroFormulario(false);

      if (formularioSemRespostaAnteriores) {
        adocaoService.postRespostasAdotante(listaRespostas).then(res => {
          setExibirModalFormulario(false);
          if (pet) adocaoService.iniciarAdocao(pet.idOng, pet.idPet)
          setExibirModalSolicitacaoEnviada(true);
        })
      } else {
        adocaoService.putRespostasAdotante(listaRespostas).then(res => {
          setExibirModalFormulario(false);
          if (pet) adocaoService.iniciarAdocao(pet.idOng, pet.idPet)
          setExibirModalSolicitacaoEnviada(true);
        })
      }
    }
  };

  const onClickDesistir = () => {
    setExibirModalDesistencia(false);
    adocaoService.desistirAdocao(idProcesso);
    setExibirModalDesistencia2(true);
  }

  const requestModalFormulario = async () => {
    setFormularioSemRespostaAnteriores(false);
    await adocaoService.getFormularioUsuario().then(async form => {
      await adocaoService.getRespostasAdotante().then(res => {
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
      }).catch(error => {
        if (error.message === 'FORMULARIO_ADOTANTE_NAO_ENCONTRADO') {
          setFormularioSemRespostaAnteriores(true);
        } else {
          throw new Error(error.message);
        }
      });
      setFormulario(form)
      setListaRespostasSelecionadas(form.formularioPergunta);
    })
    setExibirModalFormulario(true)
  }

  const handleOptionSelected = (perguntaId: number, respostaId: number) => {
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
    let newForm = formulario;
    newForm.formularioPergunta = updatedRespostas as FormularioPergunta[]
    setFormulario(newForm)
    setListaRespostasSelecionadas(updatedRespostas);
  };

  return (
    <div className="bg-background p-4">
      <BotaoVoltar id="voltar" text="Voltar" className="ml-4" onClick={() => router.back()} />
      <div className="flex justify-center">
        <div className="mt-4 gap-4 flex flex-col md:w-1/2 w-full m-4">
          <VisualizadorFotoPet photos={photos} exibirFoto={true} tipo={pet?.tipo}/>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <label className="text-2xl"> {pet?.nome}, {pet?.idade} {pet?.idade === 1 ? " ano" : " anos"}</label>
              <div className="flex flex-row gap-2 items-center">
                {pet?.sexo === "M" ? (
                  <PiGenderMale className="text-sm" />
                ) : (
                  <PiGenderFemale className="text-sm" />
                )}
                <label className="text-sm">
                  Sexo: {pet?.sexo === "M" ? "Macho" : "Fêmea"}
                </label>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <GrLocation className="text-sm" />
                <label className="text-sm">
                  Ong: {pet?.ong?.usuario.nome}
                </label>
              </div>
            </div>
            <div className="gap-4 flex flex-row">
              {!idProcesso && tipoUsuario === TipoUsuarioEnum.ADOTANTE ?
                <BotaoPrimario
                  id="adote_me"
                  text="Adote-me"
                  onClick={() => requestModalFormulario()}
                />
                : ""
              }
              {
                tipoUsuario === TipoUsuarioEnum.ONG ?
                  <BotaoPrimario id="editar" text="Editar" onClick={() => setTelaAtual("editar")} />
                  : ''
              }

              {idProcesso && (statusProcesso == 1 || statusProcesso == 2) && tipoUsuario === TipoUsuarioEnum.ADOTANTE ?
                <BotaoPrimario
                  id="desistir"
                  text="Desistir"
                  onClick={() => setExibirModalDesistencia(true)}
                />
                : ""
              }

              {idProcesso && (statusProcesso != 1 && statusProcesso != 2) && tipoUsuario === TipoUsuarioEnum.ADOTANTE ?
                <BotaoPrimario
                  id="status_do_processo"
                  text="Status do Processo"
                  onClick={() => push("/my-matches")}
                />
                : ""
              }
            </div>
          </div>
          <label className="mt-4 mb-10">{pet?.descricao}</label>
        </div>
      </div>
      <Modal title="Formulário de adoção" isOpen={exibirModalFormulario} onClose={() => setExibirModalFormulario(false)}>
        <QuestionarioAdocao formData={formulario}
          onOptionSelected={handleOptionSelected}
          bloquearEdicao={false}
        />
        {exibirErroFormulario && <span className="text-error text-sm">{mensagemErroFormulario}</span>}
        <div className="gap-4 flex flex-row justify-end mt-8">
          <BotaoTerciario
            id="cancelar"
            text="Cancelar"
            onClick={() => setExibirModalFormulario(false)}
          />
          <BotaoPrimario
            id="confirmar"
            text="Confirmar"
            onClick={onClickConfirmar}
          />
        </div>
      </Modal>
      <Modal title="Solicitação enviada" isOpen={exibirModalSolicitacaoEnviada} onClose={() => setExibirModalSolicitacaoEnviada(false)}>
        <h1 className="text-xl text-black font-bold text-center">Seu perfil foi enviado para a ONG responsável analisar!</h1>
        <h2 className="text-base text-black text-center">Você pode acompanhar o processo em Meus Matches</h2>

        <div className="gap-4 flex flex-row justify-between mt-8">
          <BotaoTerciario
            id="voltar_para_home"
            text="Voltar para Home"
            onClick={() => push('/')}
          />
          <BotaoPrimario
            id="ir_para_meus_matches"
            text="Ir para Meus Matches"
            onClick={() => push('/my-matches')}
          />
        </div>
      </Modal>

      <Modal title="Desistir" isOpen={exibirModalDesistencia} onClose={() => setExibirModalDesistencia(false)}>
        <h1 className="text-xl text-black font-bold text-center">Tem certeza que deseja desistir do processo de adoção?</h1>
        <div className="gap-4 flex flex-row justify-between mt-8">
          <BotaoTerciario
            id="rejeitar"
            text="Não"
            onClick={() => setExibirModalDesistencia(false)}
          />
          <BotaoPrimario
            id="aceitar"
            text="Sim"
            onClick={onClickDesistir}
          />
        </div>
      </Modal>

      <Modal title="Desistir" isOpen={exibirModalDesistencia2} onClose={() => {
        setExibirModalDesistencia2(false)
        push("/")
      }}>
        <h1 className="text-xl text-black font-bold text-center">Processo cancelado com sucesso</h1>
      </Modal>

    </div>
  );
}

export default VisualizarPet
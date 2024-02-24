import React, { useState } from "react";
import Formulario from "@/model/Formulario";
import Pergunta from "./Pergunta";

interface QuestionarioAdocaoProps {
  formData: Formulario | null;
  onOptionSelected: (perguntaId: number, respostaId: number) => void;
  bloquearEdicao: boolean,
}

const QuestionarioAdocao: React.FC<QuestionarioAdocaoProps> = ({
  formData,
  onOptionSelected,
  bloquearEdicao=false
}) => {
  if (!formData) {
    return null;
  }
  
  return (
    <div className="bg-white">
      {formData.formularioPergunta.map((pergunta, index) => (
        <Pergunta
          bloquearEdicao={bloquearEdicao}
          key={pergunta.idFormularioPergunta}
          resposta={pergunta.idFormularioResposta}
          text={`${index + 1}. ${pergunta.texto}`}
          name={`resposta_${pergunta.idFormularioPergunta}`}
          options={pergunta.formularioResposta.map((resposta) => ({
            id: resposta.idFormularioResposta,
            value: resposta.texto,
            text: resposta.texto,
          }))}
          onOptionSelected={(respostaId) =>
            onOptionSelected(pergunta.idFormularioPergunta, respostaId)
          }
        />
      ))}
    </div>
  );
};

export default QuestionarioAdocao;

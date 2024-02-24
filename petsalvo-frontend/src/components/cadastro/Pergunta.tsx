import React from "react";

interface Option {
  id: number;
  value: string;
  text: string;
}

interface PerguntaProps {
  text: string;
  name: string;
  resposta?:number
  options: Option[];
  bloquearEdicao: boolean;
  onOptionSelected: (respostaId: number) => void;
}

const Pergunta: React.FC<PerguntaProps> = (props) => {
  const handleOptionSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const respostaId = parseInt(event.target.value, 10);
    props.onOptionSelected(respostaId);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <p className="text-gray-800 mb-2">{props.text}</p>
      {props.options.map((option) => (
        <div className="flex items-center space-x-2 ml-2" key={option.id}>
          <input
            type="radio"
            name={props.name}
            id={option.id.toString()}
            value={option.id}
            className="text-orange-500"
            onChange={handleOptionSelected}
            checked={option.id == props.resposta}
            disabled={props.bloquearEdicao}
          />
          <label htmlFor={option.id.toString()}>{option.text}</label>
        </div>
      ))}
    </div>
  );
};

export default Pergunta;

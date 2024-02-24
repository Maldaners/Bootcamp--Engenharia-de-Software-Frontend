import FormularioResposta from './FormularioResposta';

interface FormularioPergunta {
    idFormularioPergunta: number;
    idFormularioResposta?:number;
    texto: string;
    idFormulario: number;
    formularioResposta: FormularioResposta[];
}

export default FormularioPergunta;
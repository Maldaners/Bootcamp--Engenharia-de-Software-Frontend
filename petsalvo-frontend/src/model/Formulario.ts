import FormularioPergunta from "./FormularioPergunta";

interface Formulario {
    idFormulario: number;
    titulo: string;
    descricao: string;
    formularioPergunta: FormularioPergunta[];
}

export default Formulario;
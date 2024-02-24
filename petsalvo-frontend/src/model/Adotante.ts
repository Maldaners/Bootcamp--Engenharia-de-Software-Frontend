import Usuario from './Usuario';
import Endereco from './Endereco';
import FormularioRespostaSelecionada from './FormularioRespostaSelecionada';

interface Adotante {
  usuario: Usuario;
  dataNasc: string;
  cpf: string;
  endereco: Endereco;
  formulario?: FormularioRespostaSelecionada[];
}

export default Adotante;
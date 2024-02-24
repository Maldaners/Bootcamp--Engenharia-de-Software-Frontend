import Imagem from './Imagem';

interface Usuario {
  idUsuario?: number;
  email: string;
  senha: string;
  nome: string;
  telefone: string;
  tipoUsuario?: number;
  termos: boolean;
  imagem?: Imagem;
}

export default Usuario;
import Usuario from './Usuario';
import Endereco from './Endereco';
import Pix from "./Pix";
import Status from "./Status";

interface Ong {
  usuario: Usuario;
  site: string;
  cnpj: string;
  endereco: Endereco;
  pix: Pix[];
  status: Status[];
}

export default Ong;
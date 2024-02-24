import Ong from './Ong';
import Imagem from './Imagem';

interface Pet {
    idPet: number;
    nome: string;
    idade: number;
    tipo: number;
    sexo: string;
    descricao: string;
    adotado: boolean;
    idOng: number;
    imagens?: Imagem[];
    ong?: Ong;
}

export default Pet;
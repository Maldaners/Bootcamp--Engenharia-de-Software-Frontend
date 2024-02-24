import React, { useState } from 'react';
import Pet from '@/model/Pet';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petService } from "@/services/pet.service";
import BotaoVoltar from '@/components/BotaoVoltar';
import VisualizadorFotoPet from '@/components/pet/VisualizadorFotoPet';
import BotaoPrimario from '@/components/BotaoPrimario';
import BotaoSecundario from '@/components/BotaoSecundario'
import BotaoTerciario from '@/components/BotaoTerciario'
import Input from '@/components/Input';
import CheckBox from '@/components/CheckBox';
import TextArea from '@/components/TextArea';
import Modal from '@/components/Modal';
import Popup from '@/components/Popup';
import MultipleUpload from '@/components/pet/MultipleUpload';
import Select from '@/components/Select';
import { useRouter } from 'next/navigation';

const schema = z.object({
  nome: z.string().min(1, "Campo Nome é obrigatório"),
  idade: z.string().refine(value => /^\d+$/.test(value), {
    message: 'Campo idade é obrigatório e deve conter apenas dígitos',
  }).transform(value => Number(value)).refine(value => value >= 1, {
    message: 'A idade deve ser um número maior ou igual a 1',
  }),
  tipo: z.string().refine(value => value !== "0", {
    message: 'Campo Tipo é obrigatório',
  }),
  sexo: z.string().refine(value => value !== "0", {
    message: 'Campo Sexo é obrigatório',
  }),
  descricao: z.string().min(1, "Campo Descrição é obrigatório"),
  fuiAdotado: z.boolean().optional()
})

const sexo = [
  { key: 1, value: 'M', text: 'Macho' },
  { key: 2, value: 'F', text: 'Fêmea' },
];

const tipo = [
  { key: 1, value: '1', text: 'Cachorro' },
  { key: 2, value: '2', text: 'Gato' },
];

type FormData = z.infer<typeof schema>;

interface AlterarPetProps {
  onClickVoltar: () => void;
  pet: Pet | null;
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
}

const AlterarPet: React.FC<AlterarPetProps> = ({ onClickVoltar, pet, photos, setPhotos }) => {

  const [exibirPopup, setExibirPopup] = useState(false);
  const [exibirPopupDeletar, setExibirPopupDeletar] = useState(false);
  const { push } = useRouter();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [exibirModalDeletar, setExibirModalDeletar] = useState(false);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    reValidateMode: "onBlur",
    resolver: zodResolver(schema)
  });

  const submitData = async (data: FormData) => {
    try {
      const p: Pet = {
        idPet: pet?.idPet,
        nome: data.nome,
        idade: data.idade,
        tipo: parseInt(data.tipo),
        sexo: data.sexo,
        descricao: data.descricao,
        adotado: data.fuiAdotado ? true : false
      };
      if (pet?.idPet) {
        await petService.edit(p);
        const idPet = pet.idPet;
        if (newPhotos.length > 0) {
          await petService.registerImages(idPet, newPhotos);
        }
      } else {
        const response = await petService.register(p);
        const idPet = response.idPet;
        if (photos.length > 0) {
          await petService.registerImages(idPet, newPhotos);
        }
      }

      setError(false);
      setErrorMessage("");
    } catch (error: any) {
      setError(true);
      setErrorMessage(error.message);
    }
    setExibirPopup(true);
  }

  const onClickDeletar = async () => {
    setExibirModalDeletar(false);
    try {
      if (pet?.idPet) {
        await petService.delete(pet.idPet);
      } else {
        throw new Error("não foi possivel recuperar o id do pet");
      }
      setError(false);
      setErrorMessage("");
    } catch (error: any) {
      setError(true);
      setErrorMessage(error.message);
    }
    setExibirPopupDeletar(true);
  }

  return (
    <div className="bg-background p-4">
      <BotaoVoltar id="voltar" text="Voltar" className="ml-4" onClick={onClickVoltar} />
      <div className="flex justify-center">
        <div className="mt-4 gap-4 flex flex-col md:w-1/2 w-full m-4">
          <VisualizadorFotoPet photos={photos} exibirFoto={false} tipo={undefined}/>
          <div className="justify-center flex">
            <MultipleUpload photos={photos} setPhotos={setPhotos} newPhotos={newPhotos} setNewPhotos={setNewPhotos} />
          </div>
          <form onSubmit={handleSubmit(submitData)} method="post">

            <label className="text-2xl"> Dados </label>

            <div className="flex flex-row gap-4">
              <div className="w-1/2">
                <Input
                  {...register("nome")}
                  id="nome"
                  text="Nome"
                  defaultValue={pet?.nome}
                  helperText={errors.nome?.message}
                  error={!!errors.nome?.message}
                />
              </div>
              <div className="w-1/2">
                <Input
                  {...register("idade")}
                  id="idade"
                  text="Idade (em ano)"
                  type="number"
                  defaultValue={pet?.idade}
                  helperText={errors.idade?.message}
                  error={!!errors.idade?.message}
                />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/2">
                <Select
                  {...register("sexo")}
                  id="sexo"
                  text="Sexo"
                  options={sexo}
                  defaultValue={pet?.sexo}
                  helperText={errors.sexo?.message}
                  error={!!errors.sexo?.message}
                />
              </div>
              <div className="w-1/2">
                <Select
                  {...register("tipo")}
                  id="tipo"
                  text="Tipo"
                  defaultValue={pet?.tipo}
                  options={tipo}
                  helperText={errors.tipo?.message}
                  error={!!errors.tipo?.message}
                />
              </div>
            </div>
            <TextArea
              {...register("descricao")}
              id="descricao"
              text="Descrição"
              defaultValue={pet?.descricao}
              helperText={errors.descricao?.message}
              error={!!errors.descricao?.message}
              maxLength={1000}
            />
            <div className="justify-center flex mb-5 mt-2">
              <CheckBox
                {...register("fuiAdotado")}
                id="fui_adotado"
                text="Fui adotado!"
                disabled={true}
                defaultChecked={pet?.adotado}
                helperText={errors.fuiAdotado?.message}
                error={!!errors.fuiAdotado?.message}
              />
            </div>
            <div className="justify-center flex gap-4 mb-10">
              {pet?.idPet ? (
                <>
                  <BotaoTerciario
                    id="deletar"
                    text="Deletar"
                    type="button"
                    className="w-1/3"
                    onClick={() => setExibirModalDeletar(true)}
                  />
                  <BotaoSecundario
                    id="salvar"
                    text="Salvar"
                    className="w-1/3"
                    type="submit"
                  />
                </>
              ) : (
                <BotaoPrimario
                  id="cadastrar"
                  text="Cadastrar"
                  type="submit"
                  className="w-1/3"
                />
              )
              }
            </div>
          </form>
          <Popup isOpen={exibirPopup} onClose={error ? () => setExibirPopup(false) : () => push("/")} type={error ? 'error' : 'success'} operation={'save'} message={error ? errorMessage : ""} />
          <Popup isOpen={exibirPopupDeletar} onClose={error ? () => setExibirPopupDeletar(false) : () => push("/")} type={error ? 'error' : 'success'} operation={'delete'} message={error ? errorMessage : ""} />
          <Modal title="Deletar" isOpen={exibirModalDeletar} onClose={() => setExibirModalDeletar(false)}>
            <h1 className="text-xl text-black  text-center">Tem certeza que deseja excluir este perfil?</h1>
            <div className="gap-4 flex flex-row justify-between mt-8">
              <BotaoTerciario
                id="nao_nao_quero_excluir"
                text="Não, não quero excluir"
                onClick={() => setExibirModalDeletar(false)}
              />
              <BotaoPrimario
                id="sim_quero_excluir"
                text="Sim, quero excluir"
                onClick={onClickDeletar}
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AlterarPet
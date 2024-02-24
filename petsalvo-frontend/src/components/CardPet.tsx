import { converterImagensParaFiles } from '@/utils/imagemUtils';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { PiGenderFemale, PiGenderMale, PiMapPin } from "react-icons/pi";

export default function CardPet(props: any) {
  const pet = props.pet.pet;
  const [photos, setPhotos] = useState<string[]>([]);
  const { push } = useRouter();

  useEffect(() => {
    const photos = converterImagensParaFiles(pet)
    setPhotos(photos)
  }, [pet]);

  return (
    <>
      <div
        className="bg-main-variant rounded border border-black w-auto shadow-md shadow-black/25 hover:cursor-pointer"
        onClick={() => {
          push(`/pet/${pet.idPet}/ong/${pet.idOng}`);
        }}
      >
        <div className="flex justify-center items-center relative h-52 md:h-60 w-auto border border-black object-cover overflow-hidden">
          <Image
            src={
              photos.length >= 1
                ? photos[0]
                : pet.tipo === 1
                  ? '/dog-card.svg'
                  : '/cat-card.svg'
            }
            layout="fill"
            alt="Picture of the pet"
            className="w-full object-cover"
          />
        </div>
        <div className="flex flex-col p-4 gap-2">
          <div className="flex justify-between gap-2">
            <p className="text-sm sm:text-base 2xl:text-lg truncate hover:break-normal">
              {pet.nome}, {pet.idade}
              {pet.idade === 1 ? " ano" : " anos"}
            </p>
            {pet.sexo === "M" ? (
              <PiGenderMale className="text-base md:text-xl" />
            ) : (
              <PiGenderFemale className="text-base text- md:text-xl" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <PiMapPin className="text-base md:text-xl" />
            <p className="text-xs 2xl:text-sm">{pet.ong.usuario.nome}, {pet.ong.endereco.cidade}/{pet.ong.endereco.estado}</p>
          </div>
        </div>
      </div>
    </>
  );
}

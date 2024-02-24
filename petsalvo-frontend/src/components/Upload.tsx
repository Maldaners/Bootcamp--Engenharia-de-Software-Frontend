import React, { ChangeEvent, useState } from 'react';
import { AiOutlineCamera } from "react-icons/ai"
import Image from 'next/image';

interface UploadProps {
    bloquearEdicao : boolean;
    photo: string | undefined;
    setPhoto: React.Dispatch<React.SetStateAction<string | undefined>>;
    setPhotoFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const Upload: React.FC<UploadProps> = ({photo,setPhoto, setPhotoFile, bloquearEdicao}) => {

    const [error, setError] = useState<string | null>(null);

    const photoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (file.type.startsWith('image/')) {
                setError(null);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPhoto(reader.result as string);
                    setPhotoFile(file);
                };
                reader.readAsDataURL(file);
            } else {
                setError('Por favor, selecione uma imagem válida.');
            }
        }
    };

    return (
        <>
            <div className="flex justify-center py-5">
                <label htmlFor="upload" className={bloquearEdicao ? "" : "cursor-pointer"}>
                    <div className="relative w-32 h-32 rounded-full border bg-white border-black flex items-center justify-center overflow-hidden">
                        {photo ? <Image src={photo} alt="foto do perfil" layout="fill" objectFit="cover" /> : <AiOutlineCamera className="w-10 h-10" />}
                    </div>
                    <input
                        id="upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={photoUpload}
                        disabled={bloquearEdicao}
                    />
                </label>
            </div>
            <div className="flex justify-center">
            {error && <p className="text-error text-sm">{error}</p>}
            </div>
        </>
    );
}

export default Upload
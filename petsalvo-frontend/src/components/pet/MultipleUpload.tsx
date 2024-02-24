import React, { ChangeEvent, useState } from 'react';

interface MultipleUploadProps {
    photos: string[];
    setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
    newPhotos: File[];
    setNewPhotos: React.Dispatch<React.SetStateAction<File[]>>;
}

const MultipleUpload: React.FC<MultipleUploadProps> = ({ photos, setPhotos,newPhotos, setNewPhotos }) => {

    const [error, setError] = useState<string | null>(null);

    const photoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (file.type.startsWith('image/') && /\.(jpeg|jpg|png)$/i.test(file.name)) {
                setError(null);
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (photos.length < 4) {
                        setPhotos([...photos, reader.result as string]);
                        setNewPhotos([...newPhotos,file]);
                    } else {
                        setError('Você atingiu o limite máximo de 4 fotos.');
                    }
                };
                reader.readAsDataURL(file);
            } else {
                setError('Por favor, selecione uma imagem válida. (formato .jpeg,.jpg ou .png)');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="py-5">
                <label htmlFor="upload" className="cursor-pointer">
                    <div className="border border-black bg-secondary-variant rounded-md px-3 py-4 hover:scale-105 hover:transition-transform duration-300">
                        Selecione uma foto
                    </div>
                    <input
                        id="upload"
                        type="file"
                        accept="image/jpeg, image/jpg, image/png"
                        className="hidden"
                        onChange={photoUpload}
                    />
                </label>
            </div>
            <div className="flex justify-center">
                {error && <p className="text-error text-sm">{error}</p>}
            </div>
        </div>
    );
}

export default MultipleUpload
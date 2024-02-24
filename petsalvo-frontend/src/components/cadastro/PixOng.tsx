import React, { useState } from "react";
import Select from "@/components/Select";
import Input from "@/components/Input";
import Pix from "@/model/Pix";
import { z } from "zod";

interface StatusProps {
    selectedItemsList: Pix[];
    setSelectedItemsList: React.Dispatch<React.SetStateAction<Pix[]>>;
    bloquearEdicao: boolean;
}

const tipoChaveArray = [
    { key: 1, value: '1', text: 'CPF' },
    { key: 2, value: '2', text: 'CNPJ' },
    { key: 3, value: '3', text: 'E-mail' },
    { key: 4, value: '4', text: 'Telefone' },
    { key: 5, value: '5', text: 'Aleatória' },
];

const cpfSchema = z.string().refine(value => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value), {
    message: "CPF inválido",
});

const cnpjSchema = z.string().refine(value => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value), {
    message: "CNPJ inválido",
});

const emailSchema = z.string().email({
    message: "E-mail inválido",
});

const telefoneSchema = z.string().refine(value => /^\(\d{2}\) \d{5}-\d{4}$/.test(value), {
    message: "Telefone inválido",
});

const aleatoriaSchema = z.string().refine(value => value.trim().length > 0, "Não preencheu a chave aleatória").refine(value => !/\s/.test(value), "A chave aleatória não pode conter espaços em branco");

const PixOng: React.FC<StatusProps> = ({ selectedItemsList, setSelectedItemsList, bloquearEdicao }) => {
    const [selectedItem, setSelectedItem] = useState<string>("");
    const [inputText, setInputText] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleAdd = () => {
        if (selectedItemsList.length >= 5 || !selectedItem || selectedItem === '0') {
            return;
        }

        try {
            let schema: z.ZodString;

            let validatedInput;

            switch (selectedItem) {
                case '1': // CPF
                    validatedInput = cpfSchema.parse(inputText.trim());;
                    break;
                case '2': // CNPJ
                    validatedInput = cnpjSchema.parse(inputText.trim());
                    break;
                case '3': // E-mail
                    validatedInput = emailSchema.parse(inputText.trim());;
                    break;
                case '4': // Telefone
                    validatedInput = telefoneSchema.parse(inputText.trim());;
                    break;
                case '5': // Aleatória
                    validatedInput = aleatoriaSchema.parse(inputText.trim());;
                    break;
                default:
                    validatedInput = inputText.trim();
                    break;
            }

            const newPixItem: Pix = {
                tipoChave: selectedItem,
                chave: validatedInput,
            };

            if (!selectedItemsList.some(item => item.chave === newPixItem.chave)) {
                setSelectedItemsList((prevList) => [...prevList, newPixItem]);
                setInputText("");
                setError(null);
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstError = error.errors[0];
                setError(firstError ? firstError.message : "Erro de validação");
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Erro de validação");
            }
        }
    };

    const handleRemove = () => {
        if (selectedItemsList.length > 0) {
            setSelectedItemsList((prevList) => prevList.slice(0, -1));
            setError(null);
        }
    };

    const renderInputBasedOnType = () => {
        switch (selectedItem) {
            case '1': // CPF
                return <Input text="Digite seu CPF:" mask="999.999.999-99" placeholder="000.000.000-00" onChange={(e) => setInputText(e.target.value)} value={inputText} />;
            case '2': // CNPJ
                return <Input text="Digite seu CNPJ:" mask="99.999.999/9999-99" placeholder="00.000.000/0000-00" onChange={(e) => setInputText(e.target.value)} value={inputText} />;
            case '3': // E-mail
                return <Input text="Digite seu E-mail:" placeholder="Digite aqui" type="email" onChange={(e) => setInputText(e.target.value)} value={inputText} />;
            case '4': // Telefone
                return <Input text="Digite seu Telefone:" mask="(99) 99999-9999" placeholder="(00) 91234-5678" onChange={(e) => setInputText(e.target.value)} value={inputText} />;
            case '5': // Aleatória
                return <Input text="Digite sua Chave Aleatória:" placeholder="Digite aqui" onChange={(e) => setInputText(e.target.value)} value={inputText} />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="flex-row">
                {bloquearEdicao === false &&
                    <div className="flex">
                        <div className="w-1/2">
                            <Select disabled={bloquearEdicao} options={tipoChaveArray} text="" onChange={(e) => {
                                setSelectedItem(e.target.value);
                                setInputText("");
                            }} />
                        </div>
                        <div className="w-1/2 flex items-center">
                            <div className="button-container flex space-x-2">
                                <button
                                    className="ml-4 w-10 h-10 bg-transparent border-2 border-main text-main rounded-full flex font-bold items-center justify-center text-2xl focus:outline-none"
                                    onClick={handleAdd}
                                    disabled={bloquearEdicao}
                                    type="button"
                                >
                                    <span className="shadow-inner">+</span>
                                </button>
                                <button
                                    className="w-10 h-10 bg-transparent border-2 border-error text-error rounded-full flex font-bold items-center justify-center text-2xl focus:outline-none"
                                    onClick={handleRemove}
                                    disabled={bloquearEdicao}
                                    type="button"
                                >
                                    <span className="shadow-inner">-</span>
                                </button>
                                <span className="text-base">Clique no botão para Adicionar/Remover</span>
                            </div>
                        </div>
                    </div>
                }
                {bloquearEdicao === false &&
                    <div className="flex">
                        <div className="w-1/2">
                            {renderInputBasedOnType()}
                            {error && <p className="text-error">{error}</p>}
                        </div>
                    </div>
                }
                {bloquearEdicao === true &&selectedItemsList.length === 0 && 
                    <p className="text-error">Nenhuma chave cadastrada</p>
                }
                <ul className="mt-4">
                    <div className='flex flex-wrap gap-1 overflow-auto max-h-[4.688rem]'>
                        {selectedItemsList.map(item => <div key={item.tipoChave + ": " + item.chave} className="rounded-full bg-red-500 text-white text-sm px-1 border border-black">{item.chave}</div>)}
                    </div>
                </ul>
            </div>
        </>
    );
}

export default PixOng;
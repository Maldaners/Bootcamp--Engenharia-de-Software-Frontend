import React, { useState } from "react";
import Select from "@/components/Select";
import Input from "@/components/Input";

interface StatusProps {
    selectedItemsList: string[];
    setSelectedItemsList: React.Dispatch<React.SetStateAction<string[]>>;
    bloquearEdicao: boolean;
}

const statusArray = [
    { key: 1, value: 'Aceita Pets', text: 'Aceita Pets' },
    { key: 2, value: 'Aceita Voluntários', text: 'Aceita Voluntários' },
    { key: 3, value: 'Precisa de ração', text: 'Precisa de ração' },
];

const StatusOng: React.FC<StatusProps> = ({ selectedItemsList, setSelectedItemsList, bloquearEdicao }) => {
    const [selectedItem, setSelectedItem] = useState<string>("");
    const [inputText, setInputText] = useState<string>("");

    const handleAdd = () => {
        if (selectedItemsList.length >= 5) {
            return;
        }

        if (selectedItem && selectedItem !== "0") {
            if (!selectedItemsList.includes(selectedItem)) {
                setSelectedItemsList((prevList) => [...prevList, selectedItem]);
            }
        }

        if (inputText.trim()) {
            if (!selectedItemsList.includes(inputText.trim())) {
                setSelectedItemsList((prevList) => [...prevList, inputText.trim()]);
                setInputText("");
            }
        }
    };

    const handleRemove = () => {
        if (selectedItemsList.length > 0) {
            setSelectedItemsList((prevList) => prevList.slice(0, -1));
        }
    };

    return (
        <>
            <div className="flex-row">
                {bloquearEdicao === false &&
                    <div className="flex">
                        <div className="w-1/2">
                            <Select options={statusArray} text="" disabled={bloquearEdicao} onChange={(e) => setSelectedItem(e.target.value)} />
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
                            <Input text="Outros" placeholder="Digite aqui" disabled={bloquearEdicao} onChange={(e) => setInputText(e.target.value)} value={inputText} />
                        </div>
                    </div>
                }
                 {bloquearEdicao === true &&selectedItemsList.length === 0 && 
                    <p className="text-error">Nenhum status cadastrado</p>
                }
                <ul className="mt-4">
                    <div className='flex flex-wrap gap-1 overflow-auto max-h-[4.688rem]'>
                        {selectedItemsList.map(item => <div key={item} className="rounded-full bg-red-500 text-white text-sm px-1 border border-black">{item}</div>)}</div>
                </ul>
            </div>
        </>
    );
}

export default StatusOng
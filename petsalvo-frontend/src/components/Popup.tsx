"use client"
import React, { useState } from 'react';
import { PiX, PiCheckBold } from 'react-icons/pi';
import PrimaryButton from '@/components/BotaoPrimario';
interface PopupProps {
    type: 'error' | 'success'; // Espera-se receber type = 'error' ou type = 'success'
    operation: 'save' | 'delete'; // Espera-se receber type = 'save' ou type = 'delete'
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

const Popup = (props: PopupProps) => {
    const { type, isOpen, onClose, operation,message } = props;
    const isSuccess = type === 'success';
    const successMessage = message || (operation === 'save' ? 'Salvo com sucesso!' : 'Excluído com sucesso!');
    const errorMessage = message || (operation === 'save' ? 'Erro ao salvar!' : 'Erro ao excluir!');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-[#00000024]">
            <div
                className="absolute inset-0"
                onClick={onClose}
            />
            <div className={`popup-container flex flex-col h-80 w-80 rounded-lg border border-black overflow-hidden shadow-lg shadow-black/25 relative`}>
                <section className={`flex flex-col flex-1 justify-center place-items-center  h-40.75 border-b ${isSuccess ? 'bg-main' : 'bg-deny'}`}>
                    {isSuccess ? <PiCheckBold size={100} className="text-white" /> : <PiX size={100} className="text-white" />}
                </section>
                <section className='flex flex-col flex-1 justify-center place-items-center gap-4 bg-background'>
                    <p>{isSuccess ? successMessage : errorMessage}</p>
                    <PrimaryButton
                        text="Confirmar"
                        onClick={onClose}
                    />
                </section>
            </div>
        </div>
    );
};

export default Popup;
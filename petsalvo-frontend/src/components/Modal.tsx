"use client"
import React, { ReactNode, useState } from 'react';
import { PiX } from 'react-icons/pi';
interface ModalProps {
    children: ReactNode;
    title: string;
    isOpen: boolean;
    onClose: () => void;
}

const Modal = (props: ModalProps) => {
    const { title, children, isOpen, onClose } = props;

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-[#00000024]">
            <div
                className="absolute inset-0"
                onClick={onClose}
            />
            <div className={`popup-container flex flex-col rounded-lg border border-black overflow-hidden shadow-lg shadow-black/25 relative max-h-[60vh] max-w-[80vw]`}>
                <div className='flex justify-between items-center bg-purple-variant w-full py-3 px-4 border-b border-black text-bold'>
                    <span className='text-white font-bold text-2xl'>{title}</span>
                    <span className="cursor-pointer"><PiX size={30} onClick={onClose} /></span>
                </div>
                <div className="px-12 py-5 overflow-y-auto bg-background">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
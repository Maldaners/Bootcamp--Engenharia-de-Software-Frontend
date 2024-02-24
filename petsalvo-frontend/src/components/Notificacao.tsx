import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { notificacaoService } from "@/services/notificacao.service";
import NotificacaoModel from '@/model/Notificacao';
import { getTipoUsuario } from "@/contexts/UserContext";
import { TipoUsuarioEnum } from '@/contexts/TipoUsuarioEnum';
import { StatusAdocaoAdotanteEnum } from '@/contexts/StatusAdocaoAdotanteEnum';
import { StatusAdocaoOngEnum } from '@/contexts/StatusAdocaoOngEnum';
import { converterFormatoDataHora } from '@/utils/dataUtils';

const Notificacao = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notification, setNotification] = useState<NotificacaoModel[]>([]);
    const [tipoUsuario, setTipoUsuario] = useState<TipoUsuarioEnum | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [notificationsPerPage] = useState(5);
    const notificationRef = useRef(null);
    const [notificacaoFoiDeletada, setNotificacaoFoiDeletada] = useState(false);

    const handleClickOutside = (event) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setShowNotification(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNotificacao = async () => {
        setShowNotification(!showNotification);

        if (!notificacaoFoiDeletada && notificationCount > 0) {
            try {
                await notificacaoService.deleteNotificacoes();
            } catch (error) {
                console.error("Erro ao deletar notificações:", error);
            }
            setNotificacaoFoiDeletada(true);
        }
    };

    useEffect(() => {
        setTipoUsuario(getTipoUsuario());
    }, []);

    useEffect(() => {
        const getNotificacoes = async () => {
            try {
                const response: NotificacaoModel[] = await notificacaoService.getNotificacoes();
                const notificacoesComIdProcessoAdocao = response.filter(notificacao => notificacao.idProcessoAdocao);
                const notificacoesNaoVisualizadasComIdProcessoAdocao = notificacoesComIdProcessoAdocao.filter(notificacao => !notificacao.visualizada);
                const countNaoVisualizadas = notificacoesNaoVisualizadasComIdProcessoAdocao.length;

                setNotificationCount(countNaoVisualizadas);
                setNotification(notificacoesComIdProcessoAdocao);
            } catch (error: any) {
                if (error.message !== 'NENHUMA_NOTIFICACAO_ENCONTRADA_COM_PARAMETRO_INFORMADO') {
                    console.log(error.message);
                }
            }
        };

        getNotificacoes();
    }, []);

    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = notification.slice(indexOfFirstNotification, indexOfLastNotification);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div ref={notificationRef} className="relative group mr-4">
            <div className="relative" onClick={handleNotificacao}>
                <FaBell
                    className="text-2xl text-gray-600 cursor-pointer"
                />
                {notificationCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs select-none cursor-pointer">
                        {notificationCount}
                    </div>
                )}
            </div>

            {showNotification && (
                <div className="absolute right-0 mt-2 w-56 z-50 bg-white border border-gray-300 p-4 rounded shadow-lg">
                    <p className="text-base font-semibold mb-2">
                        {notificationCount === 0 ? 'Nenhuma notificação' : notificationCount === 1 ? notificationCount + ' Nova notificação' : notificationCount + ' Novas notificações'}
                    </p>
                    {currentNotifications.map((notificacao: NotificacaoModel) => (
                        <div key={notificacao.idNotificacao} className="mb-2">
                            <p className="font-semibold text-sm">Processo #{notificacao.processoAdocao.idProcessoAdocao}</p>
                            {tipoUsuario === TipoUsuarioEnum.ONG && (
                                <p className="text-sm">{StatusAdocaoOngEnum[notificacao.statusProcessoAdocaoNotificado]}</p>
                            )}
                            {tipoUsuario === TipoUsuarioEnum.ADOTANTE && (
                                <p className="text-sm">{StatusAdocaoAdotanteEnum[notificacao.statusProcessoAdocaoNotificado]}</p>
                            )}
                            <p className="text-xs">{converterFormatoDataHora(notificacao.dataCriacao)}</p>
                        </div>
                    ))}

                    <div className="flex justify-center mt-4">
                        {Array.from({ length: Math.ceil(notification.length / notificationsPerPage) }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`mx-1 px-3 py-1 bg-gray-300 rounded ${currentPage === i + 1 ? 'bg-gray-500 text-white' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notificacao;

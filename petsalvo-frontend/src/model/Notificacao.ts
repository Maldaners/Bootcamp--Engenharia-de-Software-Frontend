import ProcessoAdocao from "./ProcessoAdocao";

interface Notificacao {
    idNotificacao: number;
    visualizada: boolean;
    statusProcessoAdocaoNotificado: number;
    dataCriacao: string;
    dataVisualizacao: string | null;
    idUsuario: number;
    idProcessoAdocao: number;
    processoAdocao: ProcessoAdocao;
}

export default Notificacao;
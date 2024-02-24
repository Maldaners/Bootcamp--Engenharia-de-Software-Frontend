import Cookies from "js-cookie";

class NotificacaoService {
  private readonly url = "http://127.0.0.1:8080/api/v1/notificacao";

  public async getNotificacoes() {
    try {
      const url = `${this.url}/todas`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (response.status === 404 && responseData.message === 'NENHUMA_NOTIFICACAO_ENCONTRADA_COM_PARAMETRO_INFORMADO') {
          throw new Error('NENHUMA_NOTIFICACAO_ENCONTRADA_COM_PARAMETRO_INFORMADO');
        }else {
          throw new Error("Erro ao ler as notificações");
        }
      }

      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Falha na comunicação');
      }
      throw new Error(error.message);
    }
  }

  public async deleteNotificacoes() {
    try {
      const url = `${this.url}/todas`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar as notificações");
      }

      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Falha na comunicação');
      }
      throw new Error(error.message);
    }
  }
}

export const notificacaoService = new NotificacaoService();
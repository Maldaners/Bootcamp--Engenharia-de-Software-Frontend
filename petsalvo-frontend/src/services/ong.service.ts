import Cookies from 'js-cookie';

class OngService {
    private readonly url = "http://127.0.0.1:8080/api/v1/ong/todas";

    private async getHeaders() {
        const storedToken = Cookies.get('accessToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
        }
    }

    public async listOngs() {
        try {
            const response = await fetch(this.url, {
                method: 'GET',
                headers: await this.getHeaders(),
            });

            if (!response.ok) {
                const responseData = await response.json();
                console.log(responseData)
                if (responseData.statusCode === 401 && responseData.message === 'USUARIO_NAO_AUTENTICADO_OU_TOKEN_EXPIRADO') {
                    throw new Error('Usuário não autenticado ou token expirado');
                } else {
                    throw new Error('Erro ao efetuar buscar ongs');
                }
            }

            const responseData = await response.json();
            return responseData;

        } catch (error: any) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Falha na comunicação');
            }
            throw new Error(error.message);

        }

    }
}

export const ongService = new OngService();
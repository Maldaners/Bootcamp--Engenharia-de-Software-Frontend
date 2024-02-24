import FormularioRespostaSelecionada from '@/model/FormularioRespostaSelecionada';
import Cookies from 'js-cookie';

class AdocaoService {
  private readonly url = "http://127.0.0.1:8080/api/v1/processo-adocao";

  private async getHeaders() {
    const storedToken = Cookies.get('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${storedToken}`
    }
  }

  public async getMatchesONG() {
    try {
      const url = `${this.url}/ong`;
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders(),
      });
      if (!response.ok)
        throw new Error("Erro ao buscar o pet");

      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch'))
        throw new Error('Falha na comunicação');

      throw new Error(error.message);
    }
  }
  public async mudaStatusAdocaoONG(idProcesso: number, tipoStatus: number) {
    try {
      const url = `${this.url}/${idProcesso}/ong/tipo-status/${tipoStatus}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: await this.getHeaders(),
      });
      if (!response.ok)
        throw new Error("Erro ao alterar o status");

      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch'))
        throw new Error('Falha na comunicação');

      throw new Error(error.message);
    }
  }

  public async getFormularioONG(idUsuario: number) {
    try {
      const url = `http://127.0.0.1:8080/api/v1/adotante/formulario-resposta/usuario/${idUsuario}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders(),
      });
      if (!response.ok)
        throw new Error("Erro ao buscar o pet");

      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch'))
        throw new Error('Falha na comunicação');

      throw new Error(error.message);
    }
  }

  public async getRespostasAdotante() {
    try {
      const url = `http://127.0.0.1:8080/api/v1/adotante/formulario-resposta`;
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders(),
      });
      if (!response.ok) {
        const responseData = await response.json();
        if (response.status === 404 && responseData.message === 'FORMULARIO_ADOTANTE_NAO_ENCONTRADO') {
          throw new Error('FORMULARIO_ADOTANTE_NAO_ENCONTRADO');
        } else {
          throw new Error("Erro ao buscar o formulario de resposta");
        }
      }
      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch'))
        throw new Error('Falha na comunicação');

      throw new Error(error.message);
    }
  }

  public async putRespostasAdotante(formulario: FormularioRespostaSelecionada[]) {
    try {
      const url = `http://127.0.0.1:8080/api/v1/adotante/formulario-resposta`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: await this.getHeaders(),
        body: JSON.stringify(formulario)
      });
      if (!response.ok){
          throw new Error("Erro ao atualizar as respostas do adotante");
      }
      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch'))
        throw new Error('Falha na comunicação');

      throw new Error(error.message);
    }
  }

  public async postRespostasAdotante(formulario: FormularioRespostaSelecionada[]) {
    try {
      const url = `http://127.0.0.1:8080/api/v1/adotante/formulario-resposta`;
      const response = await fetch(url, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(formulario)
      });
      if (!response.ok){
          throw new Error("Erro ao cadatrar as respostas do adotante");
      }
      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch'))
        throw new Error('Falha na comunicação');

      throw new Error(error.message);
    }
  }

  public async getFormularioUsuario() {
    try {
      const url = `http://127.0.0.1:8080/api/v1/adotante/formulario`;
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders(),
      });
      if (!response.ok)
        throw new Error("Erro ao buscar o pet");

      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch'))
        throw new Error('Falha na comunicação');

      throw new Error(error.message);
    }
  }

  public async getAdotantesPet(idPet: number) {
    try {
      const url = `${this.url}/ong/pet/${idPet}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: await this.getHeaders(),
      });
      if (!response.ok)
        throw new Error("Erro ao buscar o pet");
      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch'))
        throw new Error('Falha na comunicação');

      throw new Error(error.message);
    }
  }

  public async getMatchesAdotante() {
    try {
      const url = `${this.url}/adotante`;
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getHeaders(),
      });

      if (!response.ok)
        throw new Error("Erro ao buscar o pet");

      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch'))
        throw new Error('Falha na comunicação');

      throw new Error(error.message);
    }
  }

  public async iniciarAdocao(ong: number, pet: number) {
    try {
      const url = `${this.url}/adotante/ong/${ong}/pet/${pet}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: await this.getHeaders(),
      });
      if (!response.ok)
        throw new Error("Erro ao adotar o pet");
    } catch (error: any) {
      if (error.message.includes('Failed to fetch'))
        throw new Error('Falha na comunicação');
      throw new Error(error.message);
    }
  }
  public async desistirAdocao(idProcesso: number) {
    try {
      const url = `${this.url}/${idProcesso}/adotante/tipo-status/desistencia`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: await this.getHeaders(),
      });
      if (!response.ok)
        throw new Error("Erro ao desistir do processo");
    } catch (error: any) {
      if (error.message.includes('Failed to fetch'))
        throw new Error('Falha na comunicação');
      throw new Error(error.message);
    }
  }

}


export const adocaoService = new AdocaoService();
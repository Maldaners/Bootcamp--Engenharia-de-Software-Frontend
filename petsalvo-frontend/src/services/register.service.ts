import Adotante from "@/model/Adotante";
import Ong from "@/model/Ong";
import Cookies from "js-cookie";

class RegisterService {
  private readonly url = "http://127.0.0.1:8080/api/v1";

  public async registerAdotante(adotante: Adotante) {
    try {
      const url = `${this.url}/adotante`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adotante),
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (response.status === 400 && responseData.message === 'USUARIO_EXISTENTE_COM_EMAIL_INFORMADO') {
          throw new Error('Esse e-mail já foi cadastrado');
        } else {
          throw new Error("Erro ao cadastrar");
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

  
  public async registerAdotanteImage(file: File, accessToken: string) {
    try {
      const url = `${this.url}/adotante/imagem`;
      const formData = new FormData();

      formData.append('file', file, file.name);
      formData.append('type', file.type);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "accept": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar a imagem");
      }

      return await response.json();
    } catch (error: any) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Falha na comunicação");
      }
      throw new Error(error.message);
    }
  }

  public async registerOng(ong: Ong) {
    try {
      const url = `${this.url}/ong`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ong),
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (response.status === 400 && responseData.message === 'USUARIO_EXISTENTE_COM_EMAIL_INFORMADO') {
          throw new Error('Esse e-mail já foi cadastrado');
        } else {
          throw new Error("Erro ao cadastrar");
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

  public async registerOngImage(file: File,accessToken: string) {
    try {
      const url = `${this.url}/ong/imagem`;
      const formData = new FormData();

      formData.append('file', file, file.name);
      formData.append('type', file.type);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "accept": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar a imagem");
      }

      return await response.json();
    } catch (error: any) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Falha na comunicação");
      }
      throw new Error(error.message);
    }
  }

  public async getFormulario() {
    try {
      const url = `${this.url}/adotante/formulario`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (response.status === 404 && responseData.message === 'FORMULARIO_PADRAO_NAO_ENCONTRADO') {
          throw new Error('Formulário não encontrado no banco de dados');
        } else {
          throw new Error("Erro ao buscar o formulario");
        }
      }

      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Não foi possivel recuperar o formulário: Falha na comunicação');
      }
      throw new Error(error.message);
    }
  }

  public async getAdotante() {
    try {
      const url = `${this.url}/adotante`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar o adotante");
      }

      return await response.json();
    } catch (error: any) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Falha na comunicação');
      }
      throw new Error(error.message);
    }
  }

  public async getOng() {
    try {
      const url = `${this.url}/ong`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar a ong");
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

export const registerService = new RegisterService();
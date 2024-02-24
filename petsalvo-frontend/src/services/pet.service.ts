import Pet from "@/model/Pet";
import Cookies from "js-cookie";

class PetService {
  private readonly url = "http://127.0.0.1:8080/api/v1/pet";

  public async register(pet: Pet) {
    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify(pet),
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (
          response.status === 401 &&
          responseData.message === "USUARIO_NAO_AUTENTICADO_OU_TOKEN_EXPIRADO"
        ) {
          throw new Error("Usuário não autenticado");
        } else {
          throw new Error("Erro ao cadastrar");
        }
      }

      return await response.json();
    } catch (error: any) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Falha na comunicação");
      }
      throw new Error(error.message);
    }
  }

  public async registerImages(idPet: number, files: File[]) {
    try {
      const url = `${this.url}/${idPet}/imagem`;
      const formData = new FormData();

      files.forEach((file, index) => {
        formData.append('imagens', file, file.name);
        formData.append('type', file.type);
      });
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "accept": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar as imagens");
      }

      return await response.json();
    } catch (error: any) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Falha na comunicação");
      }
      throw new Error(error.message);
    }
  }

  public async edit(pet: Pet) {
    try {
      const url = `${this.url}/${pet.idPet}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify(pet),
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (
          response.status === 401 &&
          responseData.message === "USUARIO_NAO_AUTENTICADO_OU_TOKEN_EXPIRADO"
        ) {
          throw new Error("Usuário não autenticado");
        } else {
          throw new Error("Erro ao atualizar");
        }
      }

      return await response.json();
    } catch (error: any) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Falha na comunicação");
      }
      throw new Error(error.message);
    }
  }

  public async delete(idPet: number) {
    try {
      const url = `${this.url}/${idPet}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (response.status === 401 && responseData.message === "USUARIO_NAO_AUTENTICADO_OU_TOKEN_EXPIRADO") {
          throw new Error("Usuário não autenticado");
        }
        else if (response.status === 405 && responseData.message === "NAO_PERMITIDA_EXCLUSAO_TIPO_STATUS_PROCESSO_DE_ADOCAO_EM_ANALISE_OU_COM_PERFIL_ACEITO") {
          throw new Error("Não é permitido a exclusão para pet em processo de adoção");
        }
        else {
          throw new Error("Erro ao atualizar");
        }
      }

      return await response.json();
    } catch (error: any) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Falha na comunicação");
      }
      throw new Error(error.message);
    }
  }

  public async getPet(petId: string, ongId: string) {
    try {
      const url = `${this.url}/${petId}/ong/${ongId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error("Erro ao buscar o pet");
      }

      return await response.json();
    } catch (error: any) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Falha na comunicação");
      }
      throw new Error(error.message);
    }
  }

  public async getAllPets(tipoUsuario: string | null, idUsuario: number | null) {
    try {
      const token = Cookies.get("accessToken");
      if (tipoUsuario === "ONG") {
        const ong = await fetch(`http://127.0.0.1:8080/api/v1/ong/usuario/${idUsuario}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const ongInfos = await ong.json();

        const response = await fetch(`${this.url}/ong/${ongInfos.idOng}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = await response.json();
        return responseData;
      } else {
        const response = await fetch(this.url + "/todos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = await response.json();
        return responseData;
      }
    } catch (error: any) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Falha na comunicação");
      }
      throw new Error(error.message);
    }
  }
}

export const petService = new PetService();

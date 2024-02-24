class IBGEService {
    private readonly baseUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades';
  
    public async getStates() {
      try {
        const response = await fetch(`${this.baseUrl}/estados?orderBy=nome`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
        throw new Error('Erro ao buscar estados');
      }
    }
  
    public async getCities(uf: string) {
      try {
        const response = await fetch(`${this.baseUrl}/estados/${uf}/municipios`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        throw new Error('Erro ao buscar cidades');
      }
    }
  }
  
  export const ibgeService = new IBGEService();
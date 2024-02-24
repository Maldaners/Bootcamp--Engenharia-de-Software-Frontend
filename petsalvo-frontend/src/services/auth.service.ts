class AuthService {
    private readonly url = "http://127.0.0.1:8080/api/v1/autenticacao/login";
  
    public async login(email: string, senha: string) {
      try {
        const response = await fetch(this.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            senha: senha,
          }),
        });
  
        if (!response.ok) {
          const responseData = await response.json();
          console.log(responseData)
          if (responseData.statusCode === 401 && responseData.message === 'USUARIO_OU_SENHA_INVALIDOS') {
            throw new Error('Usuário ou senha inválidos');
          } else {
            throw new Error('Erro ao efetuar login');
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
  
  export const authService = new AuthService();
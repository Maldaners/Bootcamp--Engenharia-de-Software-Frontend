import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { TipoUsuarioEnum } from './TipoUsuarioEnum';

export function getTipoUsuario(): TipoUsuarioEnum | null {
    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
        const decodedToken: any = jwtDecode(accessToken);
        if (decodedToken.tipoUsuario === 1) {
            return TipoUsuarioEnum.ADMIN;
        } else if (decodedToken.tipoUsuario === 2) {
            return TipoUsuarioEnum.ONG;
        } else if (decodedToken.tipoUsuario === 3) {
            return TipoUsuarioEnum.ADOTANTE;
        }
    }
    return null;
}

export function getNome(): string | null {
    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
        const decodedToken: any = jwtDecode(accessToken);
        return decodedToken.nome;
    }
    return null;
}

export function getIdUsuario(): number | null {
    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
        const decodedToken: any = jwtDecode(accessToken);
        return decodedToken.idUsuario;
    }
    return null;
}


export function getImagemUsuario(): string | null {
    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
        const decodedToken: any = jwtDecode(accessToken);
        const url = decodedToken.imagem?.url;
        if (url) {
            const adjustedUrl = `http://localhost:8080/${url.replace(/\\/g, "/")}`;
            return adjustedUrl;
        }
    }
    return null;
}

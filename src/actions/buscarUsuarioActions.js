import {BUSCAR_USUARIO} from './types';

export const buscarUsuario = usuario => {
    console.log(usuario);
    return {
        type: BUSCAR_USUARIO,
        usuario
    }
}

import { Estudiante } from './Estudiante';
import { Usuario } from './Usuario';

export class PersonalSecretaria extends Usuario {
    constructor(
        id: number,
        nombre: string,
        correo: string,
        telefono: string,
        contrasena: string,
    ) {
        super(id, nombre, correo, telefono, contrasena, 'SECRETARIA')
    }

    public registrarEstudiante(datos: {
        nombre: string
        correo: string
        telefono: string
        contrasena: string
        grupoId?: number
    }): Estudiante {

    }
}
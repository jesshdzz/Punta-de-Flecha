import { Sistema } from './Sistema';
import { Usuario } from './Usuario';

export class PersonalSecretaria extends Usuario {
    constructor(
        id: number,
        nombre: string,
        correo: string,
        telefono: string,
        contrasena: string,
    ) {
        super(id, nombre, correo, telefono, contrasena, 'Secretaria')
    }

    public static registrarAlumno(datos: {
        nombre: string
        correo: string
        telefono: string
        contrasena: string
        grupoId: number
        montoInscripcion: number
        // documentos?: Docuemento[]
        // datosTutor?: {
        //     nombre: string
        //     correo: string
        //     telefono: string
        //     domicilio: string
    }) {
        Sistema.getInstancia().registrarEstudianteCompleto(datos)
    }
}
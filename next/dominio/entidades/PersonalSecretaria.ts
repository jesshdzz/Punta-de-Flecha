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

    public static async registrarAlumno(datos: {
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
        try {
            await Sistema.getInstancia().registrarEstudianteCompleto(datos)
        } catch (error) {
            console.error('Error al registrar alumno:', error);
            throw error; // Re-lanzar el error para que pueda ser manejado por el llamador
        }
    }
}
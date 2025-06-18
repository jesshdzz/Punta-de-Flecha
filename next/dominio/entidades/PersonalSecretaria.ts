import { Sistema } from './Sistema';
import { Usuario } from './Usuario';
import { Documento } from './Documento';


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
        documentos: Documento[]
        datosTutor: {
            nombre: string
            correo: string
            telefono: string
            domicilio: string
        }
    }) {
        try {
            await Sistema.getInstancia().registrarEstudianteCompleto(datos)
        } catch (error) {
            console.error('Error al registrar alumno:', error);
            throw error; // Re-lanzar el error para que pueda ser manejado por el llamador
        }
    }

    // Actualización de datos o reinscripción
    public static async actualizarAlumno(datos: {
        estudianteId: number;
        nombre?: string;
        correo?: string;
        telefono?: string;
        contrasena?: string;
        grupoId?: number;
        montoReinscripcion: number
        //materiasCursadas?: string[];
        //calificaciones?: Record<string, number>;
        reinscribir?: boolean;

    }) {
        console.log('[PersonalSecretaria] actualizarsss recibió:', datos);
        try {
            await Sistema.getInstancia().actualizarDatosEstudiante(datos);
        } catch (error) {
            console.error('Error al actualizar datos del estudiante:', error);
            throw error;
        }
    }

    public static async darBajaEstudiante(datos: {
        estudianteId: number
        tipo: 'BajaTemporal' | 'BajaDefinitiva'
        motivo: string      // solo para mostrar en consola
    }) {
        console.log('[PersonalSecretaria] darBajaEstudiante recibió:', datos)
        try {
            await Sistema.getInstancia().darBajaEstudiante(datos)
        } catch (error) {
            console.error('Error al dar de baja al estudiante:', error)
            // Re-lanzamos para que la capa que llama (API, UI…) lo maneje
            throw error instanceof Error ? error : new Error('Error desconocido en darBajaEstudiante')
        }
    }

}

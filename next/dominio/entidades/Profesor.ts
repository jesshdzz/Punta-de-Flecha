import { Usuario } from './Usuario'
import { Sistema } from './Sistema'

export class Profesor extends Usuario implements MaterialProfesor {
    private materialId: number[] = []
    private materiasId: number[] = []

    constructor(
        id: number,
        nombre: string,
        correo: string,
        telefono: string,
        contrasena: string,
        materiasId?: number[]
    ) {
        super(id, nombre, correo, telefono, contrasena, 'Profesor')
        if (materiasId) this.materiasId = materiasId
    }

    public static async asignarCalificacion(
        estudianteID: number,
        materiaID: number,
        parcial1: number,
        parcial2: number,
        ordinario: number,
        final: number,
    ): Promise<void> {
        const calificacion = {
            estudianteId: estudianteID,
            materiaId: materiaID,
            parcial1: parcial1,
            parcial2: parcial2,
            ordinario: ordinario,
            final: final,
        }
        
        await Sistema.getInstancia().registrarCalificacion(calificacion);
    }

    public static async asignarAsistencia(
        estudianteID: number,
        materiaID: number,
        parcial1: number,
        parcial2: number,
        final: number,
    ): Promise<void> {
        const asistencia = {
            estudianteId: estudianteID,
            materiaId: materiaID,
            parcial1: parcial1,
            parcial2: parcial2,
            final: final,
        }
        
        await Sistema.getInstancia().registrarAsistencia(asistencia);
    }

    public async agregarMaterial(datos: {
        titulo: string
        descripcion: string
        categoria: string
        archivos: File[]
    }): Promise<void> {
        const idProfesor = this.getId();
        if (!idProfesor) throw new Error("ID del profesor no definido");
        if (!datos.archivos || datos.archivos.length === 0) throw new Error("Debe subir al menos un archivo.");

        // Pasar archivos File[] reales al sistema
        await Sistema.getInstancia().agregarMaterial(
            {
                titulo: datos.titulo,
                descripcion: datos.descripcion,
                categoria: datos.categoria,
            },
            datos.archivos,
            idProfesor
        );
    }

    modificarMaterial(): boolean {
        console.log("Profesor modificó material.");
        return true
    }

    eliminarMaterial(): boolean {
        console.log("Profesor eliminó material.");
        return true
    }

    solicitarReporte(): void {
        console.log("Profesor solicitó un reporte.");
    }
}

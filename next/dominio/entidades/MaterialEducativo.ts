import { ServicioNube } from "./ServicioNube";
import { BaseDatos } from "./BaseDatos";
import { Sistema } from "./Sistema";

export class MaterialEducativo implements MaterialProfesor {
    
    constructor(
        private id: number | null,
        private titulo: string,
        private profesorId: number,          
        private fecha: Date,
        private descripcion: string,
        private categoria: string,
        private existencia: boolean,
        private tipoArchivo: string,
        private grupoId: number,
    ) {
       this.profesorId = profesorId;
       this.grupoId = grupoId;
    }

    public solicitarMaterial(): void {
        console.log("Material solicitado");
    }

    public entregarMaterial(): void {
        console.log("Material entregado");
    }

    public validarPeticion(): boolean {
        console.log("Petición validada");
        return true;
    }

    public async agregarMaterial(datos: {
        titulo: string
        descripcion: string
        categoria: string
        existencia: boolean
        tipoArchivo: string
        fecha: string
        grupoId: number
        archivos: File[]
    }): Promise<void> {
    try {
        const bd = BaseDatos.getInstancia();
        const servicioNube = ServicioNube.getInstancia();

        // Guardar material en la BD primero
        const materialId = await bd.guardarMaterial({
            titulo: datos.titulo,
            descripcion: datos.descripcion,
            categoria: datos.categoria,
            existencia: datos.existencia,
            tipoArchivo: datos.tipoArchivo,
            fecha: new Date(datos.fecha),
            profesorId: this.profesorId,
            grupoId: this.grupoId,

        });

        if (!materialId) {
            throw new Error("No se pudo guardar el material en la base de datos.");
        }

        this.setId(materialId.id);

      
        const archivosSubidos = datos.archivos.map((archivo) => {
            const extension = archivo.name.substring(archivo.name.lastIndexOf('.') + 1).toLowerCase();

            return {
                nombreArchivo: archivo.name,
                urlNube: servicioNube.generarUrlSimulada(
                    materialId.id,
                    datos.titulo,
                    extension
                ),
            };
        });

        for (const archivo of archivosSubidos) {
            await bd.guardarArchivo({
                nombreArchivo: archivo.nombreArchivo,
                urlNube: archivo.urlNube,
                material: {
                    connect: {
                        id: materialId.id,
                    },
                },
            });
        }

        // Actualizar existencia a true después de guardar archivos
        await bd.actualizarExistenciaMaterial(materialId.id);
        this.existencia = true;

        console.log("Material y archivos guardados correctamente.");
    } catch (error) {
        console.error("Error en MaterialEducativo.agregarMaterial:", error);
        throw error;
    }
}


    public setId(id: number): void {
        this.id = id;
    }

    public modificarMaterial(): boolean {
        console.log("Material modificado");
        return true;
    }

    public eliminarMaterial(): boolean {
        console.log("Material eliminado");
        return true;
    }

    public solicitarReporte(): void {   
        console.log("Reporte de material solicitado");
    }

    // Getters para todas las propiedades
    public getId(): number | null {
        return this.id;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public getProfesorId(): number {
        return this.profesorId;
    }

    public getFecha(): Date {
        return this.fecha;
    }

    public getDescripcion(): string {
        return this.descripcion;
    }

    public getCategoria(): string {
        return this.categoria;
    }

    public getExistencia(): boolean {
        return this.existencia;
    }

    public getTipoArchivo(): string {
        return this.tipoArchivo;
    }
}

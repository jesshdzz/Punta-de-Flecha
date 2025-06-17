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
    ) {
       // this.fecha = new Date(); // fecha automática cuando se crea
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
       
    }): Promise<void> {
        console.log("MaterialEducativo intenta agregarse a sí mismo (simulado):", datos.titulo);
       
        return Promise.resolve();
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
    public setId(id: number): void {
        this.id = id;
    }
}

import { Tramite } from "./Tramite";

export class Inscripcion extends Tramite {
    constructor (
        id: number | null,
        estudianteId: number,
        private grupoId: number,
    ) {
        super(id, estudianteId, 'inscripción', 'pendiente', new Date());
        this.grupoId = grupoId;
    }

    public altaEstudiante(): void {
        
    }
    
    public getId(): number | null {
        return super.getId();
    }
    public getEstudianteId(): number{
    return super.getEstudianteId();
    }
    public getGrupoId(): number {
        return this.grupoId
    }
}
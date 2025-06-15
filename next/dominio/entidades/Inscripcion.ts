import { Tramite } from "./Tramite";

export class Inscripcion extends Tramite {
    private grupoId: number;

    constructor(
        id: number | null,
        estudianteId: number,
        grupoId: number
    ) {
        super(id, estudianteId, 'Inscripcion', 'Pendiente', new Date());
        this.grupoId = grupoId;
    }

    public altaEstudiante(): void {

    }

    public getId(): number | null {
        return super.getId();
    }
    public getEstudianteId(): number {
        return super.getEstudianteId();
    }
    public getGrupoId(): number {
        return this.grupoId
    }
}
// dominio/entidades/Reinscripcion.ts
import { Tramite } from "./Tramite";

export class Reinscripcion extends Tramite {
  private grupoId: number;

  constructor(
    id: number | null,
    estudianteId: number,
    grupoId: number
  ) {
    // Llamamos al constructor padre con el tipo 'Reinscripcion'
    super(id, estudianteId, 'Reinscripcion', 'Pendiente', new Date());
    this.grupoId = grupoId;
  }

  /** Devuelve el ID del trámite */
  public getId(): number | null {
    return super.getId();
  }

  /** Devuelve el ID del estudiante asociado */
  public getEstudianteId(): number {
    return super.getEstudianteId();
  }

  /** Devuelve el ID del grupo al que se reinscribe */
  public getGrupoId(): number {
    return this.grupoId;
  }
}

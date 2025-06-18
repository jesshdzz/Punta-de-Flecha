// dominio/entidades/BajaEstudiante.ts
import { Tramite, TipoTramite, EstadoTramite } from "./Tramite";

export class BajaEstudiante extends Tramite {
  private motivo: string;

  constructor(
    id: number | null,
    estudianteId: number,
    tipo: Extract<TipoTramite, "BajaTemporal" | "BajaDefinitiva">,
    motivo: string
  ) {
    // tipo: 'BajaTemporal' o 'BajaDefinitiva', estado inicial 'Pendiente'
    super(id, estudianteId, tipo, "Pendiente", new Date());
    this.motivo = motivo;
  }

  /** Devuelve el motivo de la baja ( */
  public getMotivo(): string {
    return this.motivo;
  }

}

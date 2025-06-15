export type TipoTramite = 'Inscripcion' | 'Reinscripcion' | 'Baja' | 'Pago';
export type EstadoTramite = 'Rechazado' | 'Pendiente' | 'Aceptado';

export abstract class Tramite {
    constructor(
        private id: number | null,
        private estudianteId: number,
        private tipo: TipoTramite,
        private estado: EstadoTramite = 'Pendiente',
        private fecha: Date,
    ) { }

    public aprobar() {
        this.estado = "Aceptado";
    }

    public rechazar() {
        this.estado = "Rechazado";
    }

    public getId(): number | null {
        return this.id
    }

    public getEstudianteId(): number {
        return this.estudianteId;
    }

    public getTipo(): TipoTramite {
        return this.tipo
    }

    public getEstado(): EstadoTramite {
        return this.estado;
    }

    public getFecha(): Date {
        return this.fecha
    }

    public setId(id: number): void {
        this.id = id;
    }
}
export type TipoTramite = 'inscripción' | 'reinscripcion' | 'baja' | 'pago' | 'otro';
export type EstadoTramite = 'rechazado' | 'pendiente' | 'aprobado';

export class Tramite {
    constructor(
        private id: number | null,
        private estudianteId: number,
        private tipo: TipoTramite,
        private estado: EstadoTramite,
        private fecha: Date,
    ) { }

    public aprobar() {
        this.estado = 'aprobado';
    }

    public rechazar() {
        this.estado = 'rechazado';
    }

    public pendiente() {
        this.estado = 'pendiente';
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
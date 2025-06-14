export type TipoTramite = 'inscripción' | 'reinscripcion' | 'baja' | 'otro';
export type EstadoTramite = 'rechazado' | 'pendiente' | 'aprobado';

export class Tramite {
    constructor(
        private readonly id: number,
        private tipo: TipoTramite, // Ejemplo: 'inscripción', 'baja', 'cambio de grupo'
        private estado: EstadoTramite,
        private fecha: Date,
    ){}

    public verificar(){
        // Implementación pendiente
    }

    public validar(){
        this.estado = 'aprobado';
    }
}
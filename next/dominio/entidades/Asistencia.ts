export class Asistencia {
    constructor(
        public estudianteId: number,
        public materiaId: number,
        public parcial1: number = 0,
        public parcial2: number = 0,
        public final: number = 0,
        public fecha?: Date
    ) {
        this.final = this.calcularAsistenciaFinal();
    }

    public calcularAsistenciaFinal(): number {
        return (this.parcial1 + this.parcial2) / 2;
    }
}
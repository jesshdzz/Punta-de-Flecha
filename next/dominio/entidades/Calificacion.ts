export class Calificacion {
    constructor(
        public estudianteId: number,
        public materiaId: number,
        public parcial1: number = 0.0,
        public asistencia1: number = 0,
        public parcial2: number = 0.0,
        public asistencia2: number = 0,
        public ordinario: number = 0.0,
        public final: number = 0.0,
        public asistenciaFin: number = 0,
    ) {
        this.final = this.calcularPromedio();
        this.asistenciaFin = this.calcularAsistencia();
    }

    public calcularPromedio(): number {
        return (this.parcial1 * 0.4) + (this.parcial2 * 0.4) + (this.ordinario * 0.2)
    }

    public calcularAsistencia(): number {
        return (this.asistencia1 + this.asistencia2) / 2;
    }
}  
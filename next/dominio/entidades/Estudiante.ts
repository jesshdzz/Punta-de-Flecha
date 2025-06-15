import { infoUsuario, Usuario } from './Usuario';

export class Estudiante extends Usuario {
    private grupoId: number | null = null;
    private horarioId: number | null = null;
    private materiasId: number[] = [];
    // private calificaciones: Calificaciones[] = [];  Aun no se define Calificaciones

    constructor(
        id: number | null,
        nombre: string,
        correo: string,
        telefono: string,
        contrasena: string,
        grupoId?: number,
    ) {
        super(id, nombre, correo, telefono, contrasena, 'ESTUDIANTE');
        if (grupoId) {
            this.grupoId = grupoId;
        }
    }

    public actualizarDatos(nombre: string, telefono: string, correo: string): void {
        super.actualizarDatos(nombre, telefono, correo);
    }

    public solicitarDatos(): void {
        // Implementación pendiente
    }

    // SETTERS Y GETTERS
    public asignarGrupo(grupoId: number): void {
        this.grupoId = grupoId;
        console.log(`Grupo asignado: ${this.grupoId}`); // Solo para prueba
    }

    public obtenerGrupo(): number | null {
        return this.grupoId;
    }

    public asignarHorario(horarioId: number): void {
        this.horarioId = horarioId;
        console.log(`Horario asignado: ${this.horarioId}`); // Solo para prueba
    }

    public obtenerHorario(): number | null {
        return this.horarioId;
    }

    public getId(): number | null {
        return this.id;
    }
    public getGrupoId(): number {
        return this.grupoId ?? 0;
    }

    public obtenerInfo(): infoEstudiante {
        const info = super.obtenerInfo();
        return {
            ...info,
            grupoId: this.grupoId,
            horarioId: this.horarioId,
            materiasId: this.materiasId,
        };
    }
}

type infoEstudiante = infoUsuario & {
    grupoId: number | null;
    horarioId: number | null;
    materiasId: number[];
};
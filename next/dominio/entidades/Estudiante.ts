import { infoUsuario, Usuario } from './Usuario';
export type EstadoEstudiante = "Activo" | "BajaTemporal" | "BajaDefinitiva"

export class Estudiante extends Usuario {
    private grupoId: number | null = null;
    private horarioId: number | null = null;
    private materiasId: number[] = [];
    private estado: EstadoEstudiante="Activo";
    // private calificaciones: Calificaciones[] = [];  Aun no se define Calificaciones

    constructor(
        id: number | null,
        nombre: string,
        correo: string,
        telefono: string,
        contrasena: string,
        grupoId?: number,
    ) {
        super(id, nombre, correo, telefono, contrasena, 'Estudiante');
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
    
    public getHorario(): number | null {
        return this.horarioId;
    }

    public getGrupoId(): number {
        return this.grupoId ?? 0;
    }
    public getEstado():EstadoEstudiante{
        return this.estado
    }
    
    public setGrupo(grupoId: number): void {
        this.grupoId = grupoId;
        console.log(`Grupo asignado: ${this.grupoId}`); // Solo para prueba
    }
    
    public setHorario(horarioId: number): void {
        this.horarioId = horarioId;
        console.log(`Horario asignado: ${this.horarioId}`); // Solo para prueba
    }
    public setEstado(nuevoEstado:EstadoEstudiante): void{
        this.estado = nuevoEstado
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
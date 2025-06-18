import { BaseDatos } from "./BaseDatos";
import { MaterialEducativo } from "./MaterialEducativo";

export class Grupo {
  private id: number;
  private nombre: string;
  private grado: number;

  constructor(id: number, nombre: string, grado: number) {
    this.id = id;
    this.nombre = nombre;
    this.grado = grado;
  }

  public getId(): number {
    return this.id;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public getGrado(): number {
    return this.grado;
  }

 public async agregarMaterial(
    datos: {
        titulo: string;
        descripcion: string;
        categoria: string;
        existencia: boolean;
        tipoArchivo: string;
        profesorId: number;
    },
    archivos: File[]
    ): Promise<boolean> {
    try {
    
        const material = new MaterialEducativo(
        null,
        datos.titulo,
        datos.profesorId,
        new Date(),
        datos.descripcion,
        datos.categoria,
        datos.existencia,
        datos.tipoArchivo,
        this.id 
        );

        await material.agregarMaterial({
        ...datos,
        archivos,
        fecha: new Date().toISOString(),
        grupoId: this.id,
    });

        return true;
    } catch (error) {
        console.error("Error al agregar material al grupo:", error);
        return false;
    }
    }

}

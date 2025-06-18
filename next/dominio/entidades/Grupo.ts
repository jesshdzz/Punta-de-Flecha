import { Horario } from './Horario'

export class Grupo {
  private id: number;
  private nombre: string;
  private grado: number;

  constructor(
    id: number,
    nombre: string,
    grado: number
  ) {
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
}

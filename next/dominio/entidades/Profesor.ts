import { Usuario } from './Usuario'
import { Sistema } from './Sistema'
import { MaterialEducativo } from './MaterialEducativo'
import { ServicioNube } from './ServicioNube'

export class Profesor extends Usuario implements MaterialProfesor {
  constructor(
    id: number,
    nombre: string,
    correo: string,
    telefono: string,
    contrasena: string
  ) {
    super(id, nombre, correo, telefono, contrasena, 'Profesor')
  }

  public asignarCalificacion(estudianteID: number, valor: number): boolean {
    if (valor >= 0 && valor <= 10) {
      console.log(`Calificación de ${valor} al estudiante con ID ${estudianteID}`)
      return true
    }
    return false
  }


  public async agregarMaterial(datos: {
      titulo: string
      descripcion: string
      categoria: string
      archivos: File[]
    }): Promise<void> {
      const idProfesor = this.getId();
      if (!idProfesor) throw new Error("ID del profesor no definido");
      if (!datos.archivos || datos.archivos.length === 0) throw new Error("Debe subir al menos un archivo.");

      // Pasar archivos File[] reales al sistema
      await Sistema.getInstancia().agregarMaterial(
        {
          titulo: datos.titulo,
          descripcion: datos.descripcion,
          categoria: datos.categoria,
        },
        datos.archivos,
        idProfesor
      );
    }

  modificarMaterial(): boolean {
    console.log("Profesor modificó material.");
    return true
  }

  eliminarMaterial(): boolean {
    console.log("Profesor eliminó material.");
    return true
  }

  solicitarReporte(): void {
    console.log("Profesor solicitó un reporte.");
  }
}

export class ServicioNube {
  private static instancia: ServicioNube;

  private constructor() {}

  public static getInstancia(): ServicioNube {
    if (!ServicioNube.instancia) {
      ServicioNube.instancia = new ServicioNube();
    }
    return ServicioNube.instancia;
  }

  public generarUrlSimulada(materialId: number, tituloMaterial: string, tipoArchivo: string): string {
    return `https://nube.fake/${materialId}-${tituloMaterial.replace(/\s+/g, "_")}.${tipoArchivo}`;
  }
}

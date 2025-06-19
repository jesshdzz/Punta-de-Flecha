export class ServicioNube {
    private static instancia: ServicioNube;

    private constructor() { }

    public static getInstancia(): ServicioNube {
        if (!ServicioNube.instancia) {
            ServicioNube.instancia = new ServicioNube();
        }
        return ServicioNube.instancia;
    }

    public generarUrlSimulada(materialId: number, tituloMaterial: string, tipoArchivo: string): string {
        return `https://nube.fake/${materialId}-${tituloMaterial.replace(/\s+/g, "_")}.${tipoArchivo}`;
    }

    public obtenerUrlArchivo(materialId: number, tituloMaterial: string): string {
        // Simula la obtención de una URL de archivo desde un servicio en la nube
        const tipoArchivo = "pdf"; // Simulación del tipo de archivo
        return `https://nube.fake/${materialId}-${tituloMaterial}.${tipoArchivo}`;
    }
}

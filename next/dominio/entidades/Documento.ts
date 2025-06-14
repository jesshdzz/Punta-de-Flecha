export type TipoDocumento = 'Acta de nacimiento' | 'CURP' | 'Comprobante de domicilio' | 'Certificado de estudios' | 'Carta de buena conducta' | 'Otro';

export class Docuemento {
    constructor(
        private readonly id: number,
        private readonly nombre: string,
        private readonly tipo: string,
        private readonly fechaCreacion: Date,
        private readonly contenido: string
    ) {}

    public getId(): number {
        return this.id;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public getTipo(): string {
        return this.tipo;
    }

    public getFechaCreacion(): Date {
        return this.fechaCreacion;
    }

    public getContenido(): string {
        return this.contenido;
    }
}
import { Tramite } from "./Tramite";

export class Pago extends Tramite {
    private concepto: string;
    private monto: number;

    constructor(
        id: number | null,
        estudianteId: number,
        concepto: string,
        monto: number
    ) {
        super(id, estudianteId, 'Pago', 'Pendiente', new Date());
        this.concepto = concepto;
        this.monto = monto;
    }

    public completarPago(): void {
        super.aprobar();
    }

    public getConcepto(): string {
        return this.concepto;
    }

    public getMonto(): number {
        return this.monto
    }
}

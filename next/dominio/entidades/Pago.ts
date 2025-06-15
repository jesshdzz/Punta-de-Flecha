import { Tramite } from "./Tramite";

export class Pago extends Tramite {
    constructor(
        id: number | null,
        estudianteId: number,
        private monto: number,
    ) {
        super(id, estudianteId, 'pago', 'pendiente', new Date());
        this.monto = monto;
    }

    public completarPago(): void {
        super.aprobar();
    }

    public getMonto(): number {
        return this.monto
    }
}

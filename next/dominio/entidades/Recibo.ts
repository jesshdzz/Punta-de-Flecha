export class Recibo {
    private id: number | null;
    private pagoId: number;
    private monto: number;
    private fecha: Date;

    constructor(
        id: number | null,
        pagoId: number,
        monto: number,
        fecha: Date = new Date()
    ) {
        this.id = id;
        this.pagoId = pagoId;
        this.fecha = fecha;
        this.monto = monto;
    }

    public getId(): number | null {
        return this.id;
    }
    public getPagoId(): number {
        return this.pagoId;
    }
    public getMonto(): number {
        return this.monto;
    }
    public getFecha(): Date {
        return this.fecha;
    }

    public setId(id: number): void {
        this.id = id;
    }
    public setPagoId(pagoId: number): void {
        this.pagoId = pagoId;
    }
}
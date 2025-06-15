export class Recibo {
    constructor(
        private id: number | null,
        private pagoId: number,
        private fecha: Date,
    ) {}

    public getId(): number | null {
        return this.id;
    }

    public getPagoId(): number {
        return this.pagoId;
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
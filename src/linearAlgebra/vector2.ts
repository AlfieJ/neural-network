import { Matrix } from "./matrix";

export class Vector2 {
    private _matrix: Matrix;

    constructor(values: number) {
        this._matrix = new Matrix(values, 1);
    }

    static initializeV2(values: number[], horizontal: boolean): Vector2 {
        let v2 = new Vector2(values.length);
        values.forEach((v, i) => v2._matrix.set(i, 0, v));
        if (horizontal)
            v2._matrix = v2._matrix.transpose();
        return v2;
    }

    asMatrix(): Matrix {
        return this._matrix;
    }

    dot(v: Vector2): number {
        let v2 = this._matrix.multiply(v._matrix);
        return v2.sumColumn(0);
    }

    randomize(min: number = 0, max: number = 10, integers: boolean = true): void {
        this._matrix.randomize(min, max, integers);
    }

    toString(): string {
        let s = `${this._matrix.rows}\n`;
        for (let r = 0; r < this._matrix.rows; ++r) {
            s += `${this._matrix.get(r, 0)}\n`;
        }
        return s;
    }
}
import { Vector } from "./vector";
import { addElementwise, subtractElementwise, multiplyElementwise, mapFunction, randomFunction, elementwiseFunction } from "./linearAlgebra";


export class Matrix {
    private _values: number[][];

    constructor(private rows: number, private cols: number) {
        this._values = Array(rows);
        for (let r = 0; r < rows; ++r) {
            this._values[r] = Array(cols).fill(0);
        }
    }

    /**
     * Create a Matrix from an array of Vectors. All Vectors have to have
     * the same length since the Matrix dimensions are determined from the
     * Vector sizes.
     * The Vectors can be interpreted as a series of horizontal vectors,
     * or vertical vectors. The horizontal parameter is used to specify.
     * @param vectors
     * @param horizontal
     */
    static initialize(vectors: Vector[], horizontal: boolean): Matrix {
        // There needs to be at least 1 vector, so the matrix dimensions
        // can be determined.
        if (vectors.length < 1)
            throw new Error("Matrix.initialize: there needs to be at least one vector");

        // Make sure all vectors have the same length
        for (let i = 1; i < vectors.length; ++i) {
            if (vectors[i].length() != vectors[0].length())
                throw new Error("Matrix.initialize: vector lengths error");
        }

        let m: Matrix;
        if (horizontal) {
            m = new Matrix(vectors.length, vectors[0].length());
            for (let r = 0; r < vectors.length; ++r) {
                let vector = vectors[r];
                for (let c = 0; c < vector.length(); ++c) {
                    m.set(r, c, vector.get(c));
                }
            }
        }
        else {
            m = new Matrix(vectors[0].length(), vectors.length);
            for (let r = 0; r < vectors[0].length(); ++r) {
                for (let c = 0; c < vectors.length; ++c) {
                    m.set(r, c, vectors[c].get(r));
                }
            }
        }
        return m;
    }

    get(r: number, c: number): number {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols)
            throw new Error(`Matrix.get invalid index ${r}, ${c} (matrix size ${this.rows} x ${this.cols})`);
        return this._values[r][c];
    }

    set(r: number, c: number, value: number): void {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols)
            throw new Error(`Matrix.set invalid index ${r}, ${c} (matrix size ${this.rows} x ${this.cols})`);
        this._values[r][c] = value;
    }

    toString(): string {
        let s = `${this.rows} x ${this.cols}\n`;
        for (let r = 0; r < this.rows; ++r) {
            s += `${this.toStringRow(r)}\n`;
        }
        return s;
    }

    toStringRow(row: number): string {
        let s2 = "";
        for (let c = 0; c < this.cols; ++c) {
            if (c > 0)
                s2 += ", ";
            s2 += `${this._values[row][c].toFixed(3)}`;
        }
        return s2;
    }

    add(x: number | Matrix): Matrix {
        if (x instanceof Matrix)
            return this.doElementwiseMatrix(x, addElementwise);

        else
            return this.doElementwiseValue(x, addElementwise);
    }

    subtract(x: number | Matrix): Matrix {
        if (x instanceof Matrix)
            return this.doElementwiseMatrix(x, subtractElementwise);

        else
            return this.doElementwiseValue(x, subtractElementwise);
    }

    multiply(x: number | Matrix): Matrix {
        if (x instanceof Matrix)
            return this.doElementwiseMatrix(x, multiplyElementwise);

        else
            return this.doElementwiseValue(x, multiplyElementwise);
    }

    map(func: mapFunction): void {
        for (let r = 0; r < this.rows; ++r) {
            for (let c = 0; c < this.cols; ++c) {
                let result = func(this._values[r][c]);
                this._values[r][c] = result;
            }
        }
    }

    dot(m: Matrix): Matrix {
        if (this.cols != m.rows)
            throw new Error(`dot: matrix size mismatch ${this.rows} x ${this.cols} vs. ${m.rows} x ${m.cols}`);

        let newM = new Matrix(this.rows, m.cols);

        // Calculate the columns once for performance reasons
        let columns = Array(m.cols);
        for (let c = 0; c < m.cols; ++c)
            columns[c] = m.asColumnVector(c);

        for (let r = 0; r < this.rows; ++r) {
            let v1 = this.asRowVector(r);
            for (let c = 0; c < m.cols; ++c) {
                let v2 = columns[c];
                let dot = v1.dot(v2);
                newM._values[r][c] = dot;
            }
        }
        return newM;
    }

    asVector(): Vector {
        return this.asColumnVector(0);
    }

    asRowVector(row: number): Vector {
        if (row < 0 || row >= this.rows)
            throw new Error(`asRowVector: invalid row ${row} (matrix has ${this.rows})`);
        let values = Array(this.cols);
        for (let c = 0; c < this.cols; ++c)
            values[c] = this._values[row][c];
        return new Vector(values);
    }

    asColumnVector(col: number): Vector {
        if (col < 0 || col >= this.cols)
            throw new Error(`asColumnVector: invalid column ${col} (matrix has ${this.cols})`);
        let values = Array(this.rows);
        for (let r = 0; r < this.rows; ++r)
            values[r] = this._values[r][col];
        return new Vector(values);
    }

    randomize(min: number = 0, max: number = 10, integers: boolean = true): void {
        for (let r = 0; r < this.rows; ++r) {
            for (let c = 0; c < this.cols; ++c) {
                this._values[r][c] = Math.random() * (max - min) + min;
                if (integers)
                    this._values[r][c] = Math.floor(this._values[r][c]);
            }
        }
    }

    transpose(): Matrix {
        let newM = new Matrix(this.cols, this.rows);
        for (let r = 0; r < this.rows; ++r) {
            for (let c = 0; c < this.cols; ++c) {
                newM._values[c][r] = this._values[r][c];
            }
        }
        return newM;
    }

    private doElementwiseMatrix(m: Matrix, func: elementwiseFunction): Matrix {
        if (this.rows != m.rows || this.cols != m.cols)
            throw new Error(`doElementwiseMatrix: matrix size mismatch ${this.rows} x ${this.cols} vs. ${m.rows} x ${m.cols}`);

        let newM = new Matrix(this.rows, this.cols);
        for (let r = 0; r < this.rows; ++r) {
            for (let c = 0; c < this.cols; ++c) {
                newM._values[r][c] = func(this._values[r][c], m._values[r][c]);
            }
        }
        return newM;
    }

    private doElementwiseValue(x: number, func: elementwiseFunction): Matrix {
        let newM = new Matrix(this.rows, this.cols);
        for (let r = 0; r < this.rows; ++r) {
            for (let c = 0; c < this.cols; ++c) {
                newM._values[r][c] = func(this._values[r][c], x);
            }
        }
        return newM;
    }
}

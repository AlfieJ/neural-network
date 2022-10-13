import { addElementwise, subtractElementwise, multiplyElementwise, mapFunction, elementwiseFunction } from "./linearAlgebra";


export class Matrix {
    public _values: number[][];

    constructor(protected _rows: number, protected _cols: number) {
        if (_rows <= 0 || _cols <= 0)
            throw new Error(`Invalid Matrix size ${_rows} x ${_cols}`);
        
        this._values = Array(_rows);
        for (let r = 0; r < _rows; ++r) {
            this._values[r] = Array(_cols).fill(0);
        }
    }

    /**
     * Create a Matrix from an array of Vectors. All Vectors have to have
     * the same length since the Matrix dimensions are determined from the
     * Vector sizes.
     * The Vectors can be interpreted as a series of horizontal vectors,
     * or vertical vectors. The horizontal parameter is used to specify.
     * @param vectors
     */
    static initialize(values: number[][]): Matrix {
        // There needs to be at least 1 vector, so the matrix dimensions
        // can be determined.
        if (values.length < 1)
            throw new Error("Matrix.initialize: there needs to be at least one vector");

        // Make sure all vectors have the same length
        for (let i = 1; i < values.length; ++i) {
            if (values[i].length != values[0].length)
                throw new Error("Matrix.initialize: vector lengths error");
        }

        let m = new Matrix(values.length, values[0].length);
        values.forEach((row: number[], r: number) => {
            m._values[r] = row.map(x => x);
        });

        return m;
    }

    clone(): Matrix {
        let m = new Matrix(this._rows, this._cols);
        this._values.forEach((row: number[], r: number) =>
            m._values[r] = row.map(x => x));
        return m;
    }

    get(r: number, c: number): number {
        if (r < 0 || r >= this._rows || c < 0 || c >= this._cols)
            throw new Error(`Matrix.get invalid index ${r}, ${c} (matrix size ${this._rows} x ${this._cols})`);
        return this._values[r][c];
    }

    set(r: number, c: number, value: number): void {
        if (r < 0 || r >= this._rows || c < 0 || c >= this._cols)
            throw new Error(`Matrix.set invalid index ${r}, ${c} (matrix size ${this._rows} x ${this._cols})`);
        this._values[r][c] = value;
    }
    
    get rows(): number {
        return this._rows;
    }
    
    get cols(): number {
        return this._cols;
    }

    isEqual(m: Matrix): boolean {
        let isEqual: boolean = this._rows === m._rows && this._cols === m._cols;
        if (isEqual) {
            isEqual = this._values.every((row: number[], r: number) => {
                return row.every((value: number, c: number) => value === m._values[r][c]);
            });
        }
        return isEqual
    }

    sumRow(row: number): number {
        if (row < 0 || row >= this._rows)
            throw new Error(`Matrix.sumRow invalid row index ${row} (matrix size ${this._rows} x ${this._cols})`);
        
        return this._values[row].reduce((sum, value) => sum + value, 0.0);
    }

    sumColumn(col: number): number {
        if (col < 0 || col >= this._cols)
            throw new Error(`Matrix.sumColumn invalid column index ${col} (matrix size ${this._rows} x ${this._cols})`);
        
        let sum = 0;
        this._values.forEach((row: number[]) => sum += row[col]);
        return sum;
    }

    toString(): string {
        let s = `${this._rows} x ${this._cols}\n`;
        for (let r = 0; r < this._rows; ++r) {
            s += `${this.toStringRow(r)}\n`;
        }
        return s;
    }

    toStringRow(row: number): string {
        let str = "";
        for (let c = 0; c < this._cols; ++c) {
            if (c > 0)
                str += ", ";
            str += `${this._values[row][c].toFixed(3)}`;
        }
        return str;
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

    /**
     * Returns a new Matrix which is this matrix with the map function
     * applied to each value in the matrix.
     * @param func The function to apply
     * @returns A new matrix with func applied
     */
    map(func: mapFunction): Matrix {
        let newM = new Matrix(this._rows, this._cols);
        this._values.forEach((row: number[], r: number) => {
            newM._values[r] = row.map((v: number) => func(v))
        });
        return newM;
    }

    /**
     * Apply the map function to each value in this matrix
     * @param func The function to apply
     * @returns This matrix
     */
    mapInPlace(func: mapFunction): Matrix {
        this._values.forEach((row: number[], r: number) => {
            this._values[r] = row.map((v: number) => func(v))
        });
        return this;
    }

    /**
     * Returns a new matrix which is the dot product between this matrix and the parameter
     * @param m The matrix to apply the dot product with
     * @returns A new matrix with the dot product.
     */
    dot(m: Matrix): Matrix {
        if (this._cols != m._rows)
            throw new Error(`dot: matrix size mismatch ${this._rows} x ${this._cols} vs. ${m._rows} x ${m._cols}`);

        let newM = new Matrix(this._rows, m._cols);
        newM._values.forEach((row: number[], r: number) => {
            row.forEach((v: number, c: number) => {
                let sum = 0;
                for (let i = 0; i < this.cols; ++i) {
                    sum += this._values[r][i] * m._values[i][c];
                }
                newM._values[r][c] = sum;
            })
        });
        return newM;
    }

    /**
     * Randomize the values in this matrix
     * @param min The minimum value to enter in the cells. Default is -1.0
     * @param max The maximum value to enter in the cells. Default is 1.0
     * @param integers true if the values should be made integers (true) or should remain floats (false).
     * Floats is the default
     * @returns 
     */
    randomize(min: number = -1.0, max: number = 1.0, integers: boolean = false): Matrix {
        this._values.forEach((row: number[], r: number) => {
            if (integers)
                this._values[r] = row.map(_ => Math.floor(Math.random() * (max - min) + min));
            else
                this._values[r] = row.map(_ => Math.random() * (max - min) + min);
        });
        return this;
    }

    transpose(): Matrix {
        let newM = new Matrix(this._cols, this._rows);
        this._values.forEach((row: number[], r: number) => {
            row.forEach((v: number, c: number) => newM._values[c][r] = v)
        });
        return newM;
    }

    /**
     * Use the specified function that does something with 2 numbers, and apply
     * that function to each element in the matrix, with the matching element
     * in the other matrix.
     * For example, the function could add two numbers (a+b), so each element in
     * the matrix would be incremented by the corresponding amount at the same
     * position in the other matrix.
     * The size of this matrix and the size of the other matrix must match.
     * @param m The matrix to apply to this matrix
     * @param func The function to apply to each value in the matrix, along with the
     * corresponding element in other matrix
     * @returns A new matrix with the function applied to the values in this matrix and
     * the other matrix.
     */
    private doElementwiseMatrix(m: Matrix, func: elementwiseFunction): Matrix {
        if (this._rows != m._rows || this._cols != m._cols)
            throw new Error(`doElementwiseMatrix: matrix size mismatch ${this._rows} x ${this._cols} vs. ${m._rows} x ${m._cols}`);

        let newM = new Matrix(this._rows, this._cols);
        this._values.forEach((row: number[], r: number) => {
            newM._values[r] = row.map((v: number, c: number) => func(v, m._values[r][c]));
        });
        return newM;
    }

    /**
     * Use the specified function that does something with 2 numbers, and apply
     * that function to each element in the matrix, along with the specified x number.
     * For example, the function could add two numbers (a+b), so each element in
     * the matrix would be incremented by x.
     * @param x The number to apply to each value in the matrix
     * @param func The function to apply to each value in the matrix, along with x
     * @returns A new matrix with the function applied to the values in this matrix
     */
    private doElementwiseValue(x: number, func: elementwiseFunction): Matrix {
        let newM = new Matrix(this._rows, this._cols);
        this._values.forEach((row: number[], r: number) => {
            newM._values[r] = row.map((v: number) => func(v, x));
        });
        return newM;
    }
}

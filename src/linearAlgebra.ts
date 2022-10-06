type elementwiseFunction = (a: number, b: number) => number;

function addElementwise(a: number, b: number): number {
    return a + b;
}

function subtractElementwise(a: number, b: number): number {
    return a - b;
}

function multiplyElementwise(a: number, b: number): number {
    return a * b;
}

type mapFunction = (a: number) => number;

export function randomFunction(_: number) {
    return Math.random();
}

export function sigmoidFunction(a: number) {
    // return 1.0 / (1.0 + Math.pow(Math.E, -a));
    return 1 / (1 + Math.exp(-a));
}

export class Vector {
    /** Constructor to specify the values in the vector */
    constructor(private _values: number[]) {
    }

    /** Statically construct a Vector of the specified size, with values
     * initialized to 0
     */
    static initialize(num: number): Vector {
        let values = Array(num).fill(0);
        return new Vector(values);
    }

    length(): number {
        return this._values.length;
    }

    get(i: number): number {
        if(i < 0 || i >= this._values.length)
            throw new Error(`Vector.get invalid index ${i} (vector size ${this._values.length})`);
        return this._values[i];
    }

    set(i: number, value: number): void {
        if(i < 0 || i >= this._values.length)
            throw new Error(`Vector.set invalid index ${i} (vector size ${this._values.length})`);
        this._values[i] = value;
    }
    
    sum(): number {
        return this._values.reduce((sum, x) => sum + x, 0.0);
    }
    
    add(x: number | Vector): Vector {
        if (x instanceof Vector)
            return this.doElementwiseVector(x, addElementwise);
        else
            return this.doElementwiseValue(x, addElementwise);
    }
    
    subtract(x: number | Vector): Vector {
        if (x instanceof Vector)
            return this.doElementwiseVector(x, subtractElementwise);
        else
            return this.doElementwiseValue(x, subtractElementwise);
    }

    multiply(x: number | Vector): Vector {
        if (x instanceof Vector)
            return this.doElementwiseVector(x, multiplyElementwise);
        else
            return this.doElementwiseValue(x, multiplyElementwise);
    }

    dot(v: Vector): number {
        let v2: Vector = this.multiply(v);
        return v2.sum();
    }

    map(func: mapFunction): void {
        for (let i = 0; i < this._values.length; ++i) {
            let result = func(this._values[i]);
            this._values[i] = result;
        }
    }

    randomize(min: number = 0, max: number = 10, integers: boolean = true): void {
        // Fill the vector with random #s between 0 and 1
        this.map(randomFunction);
        for (let i = 0; i < this._values.length; ++i) {
            // And now scale those random numbers out to fit our min/max values
            this._values[i] = this._values[i] * (max - min) + min;
            if (integers)
                this._values[i] = Math.floor(this._values[i]);
        }
    }

    asMatrix(horizontal: boolean): Matrix {
        let vectors: Vector[] = [this];
        let m: Matrix = Matrix.initialize(vectors, horizontal);
        return m;
    }

    toString(): string {
        let s = `${this._values.length} size\n`;
        for (let i = 0; i < this._values.length; ++i) {
            s += this._values[i].toFixed(3) + "\n";
        }
        return s;
    }

    private doElementwiseVector(v: Vector, func: elementwiseFunction): Vector {
        if (v._values.length != this._values.length)
            throw Error(`Incompatible sizes (${this._values.length} vs. ${v._values.length})`);
        
        let newValues = Array(this._values.length);
        for (let i = 0; i < this._values.length; ++i) {
            newValues[i] = func(this._values[i], v._values[i]);
        }
        return new Vector(newValues);
    }


    private doElementwiseValue(x: number, func: elementwiseFunction): Vector {
        let newValues = Array(this._values.length);
        for (let i = 0; i < this._values.length; ++i) {
            newValues[i] = func(this._values[i], x);
        }
        return new Vector(newValues);
    }
}

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
            s += this.toStringRow(r) + "\n";
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
        this.map(randomFunction);
        for (let r = 0; r < this.rows; ++r) {
            for (let c = 0; c < this.cols; ++c) {
                this._values[r][c] = this._values[r][c] * (max - min) + min;
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

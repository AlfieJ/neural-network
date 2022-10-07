import { addElementwise, subtractElementwise, multiplyElementwise, mapFunction, randomFunction, elementwiseFunction } from "./linearAlgebra";
import { Matrix } from "./matrix";

// export class Vector {
//     /** Constructor to specify the values in the vector */
//     constructor(private _values: number[]) {
//     }

//     /** Statically construct a Vector of the specified size, with values
//      * initialized to 0
//      */
//     static initialize(num: number): Vector {
//         let values = Array(num).fill(0);
//         return new Vector(values);
//     }

//     length(): number {
//         return this._values.length;
//     }

//     get(i: number): number {
//         if (i < 0 || i >= this._values.length)
//             throw new Error(`Vector.get invalid index ${i} (vector size ${this._values.length})`);
//         return this._values[i];
//     }

//     set(i: number, value: number): void {
//         if (i < 0 || i >= this._values.length)
//             throw new Error(`Vector.set invalid index ${i} (vector size ${this._values.length})`);
//         this._values[i] = value;
//     }

//     sum(): number {
//         return this._values.reduce((sum, x) => sum + x, 0.0);
//     }

//     add(x: number | Vector): Vector {
//         if (x instanceof Vector)
//             return this.doElementwiseVector(x, addElementwise);

//         else
//             return this.doElementwiseValue(x, addElementwise);
//     }

//     subtract(x: number | Vector): Vector {
//         if (x instanceof Vector)
//             return this.doElementwiseVector(x, subtractElementwise);

//         else
//             return this.doElementwiseValue(x, subtractElementwise);
//     }

//     multiply(x: number | Vector): Vector {
//         if (x instanceof Vector)
//             return this.doElementwiseVector(x, multiplyElementwise);

//         else
//             return this.doElementwiseValue(x, multiplyElementwise);
//     }

//     dot(v: Vector): number {
//         let v2: Vector = this.multiply(v);
//         return v2.sum();
//     }

//     map(func: mapFunction): void {
//         for (let i = 0; i < this._values.length; ++i) {
//             let result = func(this._values[i]);
//             this._values[i] = result;
//         }
//     }

//     randomize(min: number = 0, max: number = 10, integers: boolean = true): void {
//         for (let i = 0; i < this._values.length; ++i) {
//             // And now scale those random numbers out to fit our min/max values
//             this._values[i] = Math.random() * (max - min) + min;
//             if (integers)
//                 this._values[i] = Math.floor(this._values[i]);
//         }
//     }

//     asMatrix(horizontal: boolean): Matrix {
//         let vectors: Vector[] = [this];
//         let m: Matrix = Matrix.initialize(vectors, horizontal);
//         return m;
//     }

//     toString(): string {
//         let s = `${this._values.length}\n`;
//         for (let i = 0; i < this._values.length; ++i) {
//             s += `${this._values[i].toFixed(3)}\n`;
//         }
//         return s;
//     }

//     private doElementwiseVector(v: Vector, func: elementwiseFunction): Vector {
//         if (v._values.length != this._values.length)
//             throw Error(`Incompatible sizes (${this._values.length} vs. ${v._values.length})`);

//         let newValues = Array(this._values.length);
//         for (let i = 0; i < this._values.length; ++i) {
//             newValues[i] = func(this._values[i], v._values[i]);
//         }
//         return new Vector(newValues);
//     }


//     private doElementwiseValue(x: number, func: elementwiseFunction): Vector {
//         let newValues = Array(this._values.length);
//         for (let i = 0; i < this._values.length; ++i) {
//             newValues[i] = func(this._values[i], x);
//         }
//         return new Vector(newValues);
//     }
// }

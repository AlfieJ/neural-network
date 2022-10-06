import { Matrix, Vector } from "./linearAlgebra";
import { NeuralNetwork } from "./neuralNetwork";
import { Perceptron, f } from "./perceptron";

// function func(x: number): number {
//     return .3 * x + .2;
// }

// function sign(x: number): number {
//     let num = func(x);
//     return (x >= num) ? 1.0 : -1.0;
// }

// let p = new Perceptron(3);
// let inputs: number[] = [-1, 0.5, 1];
// let guess = p.guess(inputs, sign);

// console.log(guess);
// console.log(p.toString());

// let v1 = Vector.initialize(3);
// v1.randomize(1, 10);
// console.log(v1.toString());

// let v2 = v1.add(7);
// console.log(v2.toString());

// let v3 = v1.multiply(3);
// console.log(v3.toString());

// let sum = v1.sum();
// console.log(sum);

// let v1v2 = v1.add(v2);
// console.log(v1v2.toString());

// let dotv1v2 = v1.dot(v2);
// console.log(dotv1v2.toString());

// let m1 = new Matrix(2, 3);
// m1.randomize();
// console.log(m1.toString());

// let m2 = new Matrix(3, 1);
// m2.randomize();
// console.log(m2.toString());

// let m4 = m1.dot(m2);
// console.log(m4.toString());


let nn = new NeuralNetwork(2, 2, 1);
let input = new Vector([1, 0]);
let output = nn.feedForward(input);
console.log(output.toString());

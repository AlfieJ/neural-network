import { runInThisContext } from "vm";
import { Matrix, sigmoidFunction, Vector } from "./linearAlgebra";

export class NeuralNetwork {
    private weights_ih: Matrix;
    private weights_ho: Matrix;
    private bias_h: Matrix;
    private bias_o: Matrix;

    constructor(private numInput: number, private numHidden: number, private numOutput: number) {
        this.weights_ih = new Matrix(numHidden, numInput);
        this.weights_ho = new Matrix(numOutput, numHidden);
        this.weights_ih.randomize(-1, 1, false);
        this.weights_ho.randomize(-1, 1, false);

        this.bias_h = new Matrix(numHidden, 1);
        this.bias_o = new Matrix(numOutput, 1);
        this.bias_h.randomize();
        this.bias_o.randomize();
    }

    feedForward(inputs: Vector): Vector {
        let inputsMatrix: Matrix = inputs.asMatrix(false);

        let hidden = this.weights_ih.dot(inputsMatrix);
        hidden = hidden.add(this.bias_h);
        hidden.map(sigmoidFunction);

        let output = this.weights_ho.dot(hidden);
        output = output.add(this.bias_o);
        output.map(sigmoidFunction);

        return output.asVector();
    }
}
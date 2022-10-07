import { sigmoidFunction, sigmoidFunctionDerivative } from "./linearAlgebra/linearAlgebra";
import { Matrix } from "./linearAlgebra/matrix";
// import { Vector } from "./linearAlgebra/vector";
import { Vector2 } from "./linearAlgebra/vector2";

export class NeuralNetwork {
    private weights_ih: Matrix;
    private weights_ho: Matrix;
    private bias_h: Matrix;
    private bias_o: Matrix;

    constructor(private numInput: number, private numHidden: number, private numOutput: number, private _learningRate: number = 0.1) {
        this.weights_ih = new Matrix(numHidden, numInput);
        this.weights_ho = new Matrix(numOutput, numHidden);
        this.weights_ih.randomize(-1, 1, false);
        this.weights_ho.randomize(-1, 1, false);

        this.bias_h = new Matrix(numHidden, 1);
        this.bias_o = new Matrix(numOutput, 1);
        this.bias_h.randomize(-1, 1, false);
        this.bias_o.randomize(-1, 1, false);
    }

    feedForward(inputs: Vector2): Matrix {
        let hidden = this.weights_ih.dot(inputs.asMatrix());
        hidden = hidden.add(this.bias_h);
        hidden.mapInPlace(sigmoidFunction);

        let output = this.weights_ho.dot(hidden);
        output = output.add(this.bias_o);
        output.mapInPlace(sigmoidFunction);

        return output;
    }

    train(inputs: Vector2, targets: Vector2): void {
        // copied from feedForward
        let hidden = this.weights_ih.dot(inputs.asMatrix());
        hidden = hidden.add(this.bias_h);
        hidden = hidden.map(sigmoidFunction);

        let output = this.weights_ho.dot(hidden);
        output = output.add(this.bias_o);
        output.mapInPlace(sigmoidFunction);

        // Calculate error between output and targets
        let tm = targets.asMatrix();
        let output_error = tm.subtract(output);

        // adjust hidden-output weights

        // Calculate gradients
        let gradients = output.map(sigmoidFunctionDerivative);
        gradients = gradients.multiply(output_error);
        gradients = gradients.multiply(this._learningRate);

        console.table(gradients._values);

        let hidden_t = hidden.transpose();
        let weight_ho_d = gradients.multiply(hidden_t);

        // Adjust weights with the calculated deltas
        this.weights_ho = this.weights_ho.add(weight_ho_d);

        this.bias_o = this.bias_o.add(gradients);

        // adjust input-hidden weights
        let weights_ho_t = this.weights_ho.transpose();
        let hidden_error = weights_ho_t.multiply(output_error);

        let hidden_gradients = hidden.map(sigmoidFunctionDerivative);
        hidden_gradients = hidden_gradients.multiply(hidden_error);
        hidden_gradients = hidden_gradients.multiply(this._learningRate);

        let inputs_t = inputs.asMatrix().transpose();
        let weight_ih_d = hidden_gradients.multiply(inputs_t);

        this.weights_ih = this.weights_ih.add(weight_ih_d);
        this.bias_h = this.bias_h.add(hidden_gradients);

        console.log(output.toString());
        console.log(output_error.toString());
    }
}
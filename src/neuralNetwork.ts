import { sigmoidFunction, sigmoidFunctionDerivative } from "./linearAlgebra/linearAlgebra";
import { Matrix } from "./linearAlgebra/matrix";

export function randomEntry<T>(list: T[]): T | undefined {
    if (list.length === 0)
        return undefined;
    return list[Math.floor(Math.random() * list.length)];
}

export class TrainingData {
    constructor(public inputs: number[], public targets: number[]) {
    }

    inputsAsMatrix(): Matrix {
        // For the NN, we want the inputs to be a vertical matrix
        return Matrix.initialize([this.inputs]).transpose();
    }

    targetsAsMatrix(): Matrix {
        // For the NN, we want the targets to be a vertical matrix
        return Matrix.initialize([this.targets]).transpose();
    }

    toString(): string {
        let str = `${this.inputsAsMatrix().toString()}, ${this.targetsAsMatrix().toString()}`;
        return str;
    }
}

/**
 * Based on the book "Make Your Own Neural Network" by Tariq Rashid
 */
export class NeuralNetwork {
    private _weights_ih: Matrix;
    private _weights_ho: Matrix;
    private _bias_h: Matrix;
    private _bias_o: Matrix;

    constructor(private _numInput: number, private _numHidden: number, private _numOutput: number, private _trainingRate: number = 0.1) {
        this._weights_ih = new Matrix(_numHidden, _numInput).randomize();
        this._weights_ho = new Matrix(_numOutput, _numHidden).randomize();
        this._bias_h = new Matrix(_numHidden, 1).randomize();
        this._bias_o = new Matrix(_numOutput, 1).randomize();
    }

    toString(): string {
        let str: string = `Input: ${this._numInput}, hidden: ${this._numHidden}, output: ${this._numOutput}\n`;
        str += "Weights input->hidden:\n";
        str += this._weights_ih.toString();
        str += "\nHidden bias:\n";
        str += this._bias_h.toString();
        str += "\nWeights hidden->output\n";
        str += this._weights_ho.toString();
        str += "\nOutput bias:\n";
        str += this._bias_o.toString();
        return str;
    }

    makeGuess(inputs: number[]): Matrix {
        let inputsMatrix = Matrix.initialize([inputs]).transpose();

        let hidden = this._weights_ih.dot(inputsMatrix);
        hidden = hidden.add(this._bias_h);
        hidden.mapInPlace(sigmoidFunction);

        let output = this._weights_ho.dot(hidden);
        output = output.add(this._bias_o);
        output.mapInPlace(sigmoidFunction);

        return output;
    }

    train(trainingData: TrainingData): number {
        let dataInputsMatrix = trainingData.inputsAsMatrix();
        let trainingMatrix = trainingData.targetsAsMatrix();

        // copied from feedForward
        let hidden = this._weights_ih.dot(dataInputsMatrix);
        hidden = hidden.add(this._bias_h);
        hidden = hidden.map(sigmoidFunction);
        
        let output = this._weights_ho.dot(hidden);
        output = output.add(this._bias_o);
        output.mapInPlace(sigmoidFunction);
        
        // Calculate error between output and targets
        let output_error = trainingMatrix.subtract(output);

        let averageError = output_error.sumColumn(0) / output_error.rows;

        // adjust hidden-output weights
        
        // Calculate gradients
        let gradients = output.map(sigmoidFunctionDerivative);
        gradients = gradients.dot(output_error);
        gradients = gradients.multiply(this._trainingRate);
        
        let hidden_t = hidden.transpose();
        let weight_ho_d = gradients.dot(hidden_t);

        // Adjust weights with the calculated deltas
        this._weights_ho = this._weights_ho.add(weight_ho_d);
        
        this._bias_o = this._bias_o.add(gradients);
        
        // adjust input-hidden weights
        let weights_ho_t = this._weights_ho.transpose();
        let hidden_error = weights_ho_t.dot(output_error);
        
        let hidden_gradients = hidden.map(sigmoidFunctionDerivative);
        hidden_gradients = hidden_gradients.multiply(hidden_error); // not .dot
        hidden_gradients = hidden_gradients.multiply(this._trainingRate);
        
        let inputs_t = dataInputsMatrix.transpose();
        let weight_ih_d = hidden_gradients.dot(inputs_t);
        
        this._weights_ih = this._weights_ih.add(weight_ih_d);
        this._bias_h = this._bias_h.add(hidden_gradients);

        // console.log(this.toString());

        return averageError;
    }

    serialize(): string {
        return JSON.stringify(this);
    }

    static deserialize(json: string): NeuralNetwork {
        let parsed: NeuralNetwork = JSON.parse(json);
        return parsed;
    }
}
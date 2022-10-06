export type f = (x: number) => number;
export type perceptionCallback = (num: number) => number;

export class Perceptron {
    weights: number[];

    constructor(private inputs: number, public learningRate: number = 0.1) {
        this.weights = new Array(inputs);
        for (let i = 0; i < inputs; ++i) {
            this.weights[i] = this.randomFloat(-1, 1);
        }
    }

    public guess(inputs: number[], callback: perceptionCallback): number {
        if (inputs.length != this.weights.length)
            throw Error("# of inputs doesn't match # of weights");
        
        let reduction = inputs.reduce((sum, curr, i) => sum + (curr * this.weights[i]), 0.0);
        return callback(reduction);
    }

    public train(inputs: number[], callback: perceptionCallback, target: number): void {
        let g = this.guess(inputs, callback);
        let err = target - g;
        for (let i = 0; i < this.weights.length; ++i) {
            this.weights[i] += err * inputs[i] * this.learningRate;
        }
    }

    public randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public toString(): string {
        let s = `length: ${this.weights.length} -- [`;
        for (let i = 0; i < this.weights.length; ++i) {
            if (i > 0)
                s += ", ";
            s += `${this.weights[i]}`;
        }
        return s;
    }
}

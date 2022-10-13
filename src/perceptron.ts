export type f = (x: number) => number;
export type perceptionCallback = (num: number) => number;

export class Perceptron {
    _weights: number[];

    constructor(private _inputs: number, public learningRate: number = 0.1) {
        this._weights = new Array(_inputs);
        for (let i = 0; i < _inputs; ++i) {
            this._weights[i] = this.randomFloat(-1, 1);
        }
    }

    public guess(inputs: number[], callback: perceptionCallback): number {
        if (inputs.length != this._weights.length)
            throw Error("# of inputs doesn't match # of weights");
        
        let reduction = inputs.reduce((sum, curr, i) => sum + (curr * this._weights[i]), 0.0);
        return callback(reduction);
    }

    public train(inputs: number[], callback: perceptionCallback, target: number): void {
        let g = this.guess(inputs, callback);
        let err = target - g;
        for (let i = 0; i < this._weights.length; ++i) {
            this._weights[i] += err * inputs[i] * this.learningRate;
        }
    }

    public randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public toString(): string {
        let s = `length: ${this._weights.length} -- [`;
        for (let i = 0; i < this._weights.length; ++i) {
            if (i > 0)
                s += ", ";
            s += `${this._weights[i]}`;
        }
        return s;
    }
}

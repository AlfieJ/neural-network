import { NeuralNetwork, randomEntry, TrainingData } from "./neuralNetwork";

// xor

let trainingValues = [
    new TrainingData([0, 0], [0]),
    new TrainingData([0, 1], [1]),
    new TrainingData([1, 0], [1]),
    new TrainingData([1, 1], [0]),
];

let nn = new NeuralNetwork(2, 4, 1);
let averageError = 1.0;
let trainCount = 0;

do {
    for (let r = 0; r < 1000; ++r) {
        let randomData = randomEntry(trainingValues);
        if (randomData === undefined) {
            console.log("undefined training data");
            continue;
        }
        
        ++trainCount;
        averageError = nn.train(randomData);
    }
} while (Math.abs(averageError) > 0.01);

console.log(`Training took ${trainCount}`);

let _00 = nn.makeGuess(trainingValues[0].inputs);
let _01 = nn.makeGuess(trainingValues[1].inputs);
let _10 = nn.makeGuess(trainingValues[2].inputs);
let _11 = nn.makeGuess(trainingValues[3].inputs);

console.log("0, 0\n", _00.toString());
console.log("0, 1\n", _01.toString());
console.log("1, 0\n", _10.toString());
console.log("1, 1\n", _11.toString());

console.log(nn.serialize());
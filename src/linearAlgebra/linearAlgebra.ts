
export type elementwiseFunction = (a: number, b: number) => number;

export function addElementwise(a: number, b: number): number {
    return a + b;
}

export function subtractElementwise(a: number, b: number): number {
    return a - b;
}

export function multiplyElementwise(a: number, b: number): number {
    return a * b;
}

export type mapFunction = (a: number) => number;

export function randomFunction(_: number) {
    return Math.random();
}

export function sigmoidFunction(a: number) {
    // return 1.0 / (1.0 + Math.pow(Math.E, -a));
    return 1 / (1 + Math.exp(-a));
}



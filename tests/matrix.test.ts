import { Matrix } from "../src/linearAlgebra/matrix";

describe('Matrix', () => {
    test('should have the right dimensions, and be filled with 0s', () => {
        let m = new Matrix(3, 2);
        expect(m.rows).toBe(3);
        expect(m.cols).toBe(2);
        for (let r = 0; r < 3; ++r)
            for (let c = 0; c < 2; ++c) {
                expect(m.get(r, c)).toBe(0);
            }
    })
    test('should throw on bad size', () => {
        expect(() => new Matrix(2, 0)).toThrow();
        expect(() => new Matrix(0, 5)).toThrow();
    })
    test('should initialize OK', () => {
        let values = [
            [2, 3, 5],
            [7, 11, 13],
        ]
        let m = Matrix.initialize(values);
        expect(m.rows).toBe(2);
        expect(m.cols).toBe(3);
        expect(m.get(0, 0)).toBe(2);
        expect(m.get(0, 1)).toBe(3);
        expect(m.get(0, 2)).toBe(5);
        expect(m.get(1, 0)).toBe(7);
        expect(m.get(1, 1)).toBe(11);
        expect(m.get(1, 2)).toBe(13);
    })
    test('should throw on bad initialization', () => {
        // The rows can't be different lengths
        let values = [
            [2, 3, 5],
            [7, 11, 13, 17],
        ];
        expect(() => Matrix.initialize(values)).toThrow();

        // And have to have something to size off of
        values = [];
        expect(() => Matrix.initialize(values)).toThrow();
    })
    test('Should throw on invalid accesses', () => {
        let m = new Matrix(3, 2);
        expect(() => m.get(4, 4)).toThrow();
        expect(() => m.get(3, 1)).toThrow();
        expect(() => m.get(0, 2)).toThrow();
        expect(() => m.get(-1, 0)).toThrow();
        expect(() => m.get(0, -1)).toThrow();
    })
    test('Should clone OK', () => {
        let m = new Matrix(3, 2);
        m.randomize();
        let m2 = m.clone();
        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 2; ++c) {
                expect(m.get(r, c)).toBe(m2.get(r, c));
            }
        }
    })
    test('should add value OK', () => {
        let values = [
            [2, 3, 5],
            [7, 11, 13],
        ];
        let m = Matrix.initialize(values);
        m = m.add(3);
        expect(m.get(0, 0)).toBe(5);
        expect(m.get(0, 1)).toBe(6);
        expect(m.get(0, 2)).toBe(8);
        expect(m.get(1, 0)).toBe(10);
        expect(m.get(1, 1)).toBe(14);
        expect(m.get(1, 2)).toBe(16);
    })
    test('should add matrix OK', () => {
        let values = [
            [2, 3, 5],
            [7, 11, 13],
        ];
        let values2 = [
            [3, 5, 7],
            [11, 13, 17],
        ];
        let m1 = Matrix.initialize(values);
        let m2 = Matrix.initialize(values2);
        let m3 = m1.add(m2);
        expect(m3.get(0, 0)).toBe(5);
        expect(m3.get(0, 1)).toBe(8);
        expect(m3.get(0, 2)).toBe(12);
        expect(m3.get(1, 0)).toBe(18);
        expect(m3.get(1, 1)).toBe(24);
        expect(m3.get(1, 2)).toBe(30);
    })
    test('should multiply value OK', () => {
        let values = [
            [2, 3, 5],
            [7, 11, 13],
        ];
        let m = Matrix.initialize(values);
        m = m.multiply(3);
        expect(m.get(0, 0)).toBe(6);
        expect(m.get(0, 1)).toBe(9);
        expect(m.get(0, 2)).toBe(15);
        expect(m.get(1, 0)).toBe(21);
        expect(m.get(1, 1)).toBe(33);
        expect(m.get(1, 2)).toBe(39);
    })
    test('should elementwise multiply matrix OK', () => {
        let values = [
            [2, 3, 5],
            [7, 11, 13],
        ];
        let values2 = [
            [3, 5, 7],
            [11, 13, 17],
        ];
        let m1 = Matrix.initialize(values);
        let m2 = Matrix.initialize(values2);
        let m3 = m1.multiply(m2);
        expect(m3.get(0, 0)).toBe(6);
        expect(m3.get(0, 1)).toBe(15);
        expect(m3.get(0, 2)).toBe(35);
        expect(m3.get(1, 0)).toBe(77);
        expect(m3.get(1, 1)).toBe(143);
        expect(m3.get(1, 2)).toBe(221);
    })
    test('transposes OK', () => {
        let m1 = new Matrix(3, 2);
        m1.randomize();
        let m2 = m1.transpose();

        expect(m1.rows).toBe(3);
        expect(m1.cols).toBe(2);
        expect(m2.rows).toBe(2);
        expect(m2.cols).toBe(3);
        expect(m2.get(0, 0)).toBe(m1.get(0, 0));
        expect(m2.get(0, 1)).toBe(m1.get(1, 0));
        expect(m2.get(0, 2)).toBe(m1.get(2, 0));
        expect(m2.get(1, 0)).toBe(m1.get(0, 1));
        expect(m2.get(1, 1)).toBe(m1.get(1, 1));
        expect(m2.get(1, 2)).toBe(m1.get(2, 1));

        m1 = new Matrix(1, 4);
        m2 = m1.transpose();
        expect(m2.rows).toBe(4);
        expect(m2.cols).toBe(1);
    })
    test('dot product works OK', () => {
        let values = [
            [2, 3],
            [7, 11],
        ];
        let values2 = [
            [5, 7],
            [13, 17],
        ];
        let m1 = Matrix.initialize(values);
        let m2 = Matrix.initialize(values2);
        let m3 = m1.dot(m2);
        expect(m3.rows).toBe(2);
        expect(m3.cols).toBe(2);
        expect(m3.get(0, 0)).toBe(49);
        expect(m3.get(0, 1)).toBe(65);
        expect(m3.get(1, 0)).toBe(178);
        expect(m3.get(1, 1)).toBe(236);

        values = [
            [2],
            [3],
            [5],
            [7],
        ];
        values2 = [
            [11, 13, 17, 23]
        ];
        m1 = Matrix.initialize(values);
        m2 = Matrix.initialize(values2);
        m3 = m1.dot(m2);
        expect(m3.rows).toBe(4);
        expect(m3.cols).toBe(4);
        expect(m3.get(0, 0)).toBe(22);
        expect(m3.get(0, 1)).toBe(26);
        expect(m3.get(0, 2)).toBe(34);
        expect(m3.get(0, 3)).toBe(46);
        expect(m3.get(1, 0)).toBe(33);
        expect(m3.get(1, 1)).toBe(39);
        expect(m3.get(1, 2)).toBe(51);
        expect(m3.get(1, 3)).toBe(69);
        expect(m3.get(2, 0)).toBe(55);
        expect(m3.get(2, 1)).toBe(65);
        expect(m3.get(2, 2)).toBe(85);
        expect(m3.get(2, 3)).toBe(115);
        expect(m3.get(3, 0)).toBe(77);
        expect(m3.get(3, 1)).toBe(91);
        expect(m3.get(3, 2)).toBe(119);
        expect(m3.get(3, 3)).toBe(161);
    })
});



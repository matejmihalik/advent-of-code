import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2015/14', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(2640);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(1102);
    });
});

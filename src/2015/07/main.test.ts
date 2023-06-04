import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2015/07', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(3176);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(14710);
    });
});

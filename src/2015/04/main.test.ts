import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2015/04', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(254575);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(1038736);
    });
});

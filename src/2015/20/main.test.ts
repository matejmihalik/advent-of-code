import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2015/20', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(831600);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(884520);
    });
});

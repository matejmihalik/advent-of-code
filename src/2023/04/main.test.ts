import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2023/04', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(23678);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(15455663);
    });
});

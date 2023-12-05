import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2023/05', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(836040384);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(10834440);
    });
});

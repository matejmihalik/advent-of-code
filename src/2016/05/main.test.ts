import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2016/05', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe('801b56a7');
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe('424a0197');
    });
});

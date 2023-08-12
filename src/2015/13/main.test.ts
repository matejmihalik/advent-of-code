import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2015/13', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(709);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(668);
    });
});

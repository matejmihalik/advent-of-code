import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2015/11', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe('cqjxxyzz');
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe('cqkaabcc');
    });
});

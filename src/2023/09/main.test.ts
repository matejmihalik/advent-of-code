import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2023/09', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(2105961943);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(1019);
    });
});

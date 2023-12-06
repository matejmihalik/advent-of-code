import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2023/06', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(227850);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(42948149);
    });
});

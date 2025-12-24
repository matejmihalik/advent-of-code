import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2025/06', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(5322004718681);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(9876636978528);
    });
});

import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2025/09', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(4749929916);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(0);
    });
});

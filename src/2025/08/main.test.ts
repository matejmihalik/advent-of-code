import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2025/08', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(153328);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(6095621910);
    });
});

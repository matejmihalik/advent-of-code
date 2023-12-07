import { describe, expect, it } from 'vitest';
import { partOne, partTwo } from './main.ts';

describe('2023/07', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(247823654);
    });

    it('solves the second part', () => {
        const secondSolution = partTwo();
        expect(secondSolution).toBe(245461700);
    });
});

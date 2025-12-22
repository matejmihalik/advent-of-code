import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2025/02', () => {
    it('solves part one', () => {
        const partOneResult = partOne();
        expect(partOneResult).toBe(24747430309);
    });

    it('solves part two', () => {
        const partTwoResult = partTwo();
        expect(partTwoResult).toBe(30962646823);
    });
});

import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2025/04', () => {
    it('solves part one', () => {
        const partOneResult = partOne();
        expect(partOneResult).toBe(1356);
    });

    it('solves part two', () => {
        const partTwoResult = partTwo();
        expect(partTwoResult).toBe(8713);
    });
});

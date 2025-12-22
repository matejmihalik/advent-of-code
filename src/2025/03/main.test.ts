import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2025/03', () => {
    it('solves part one', () => {
        const partOneResult = partOne();
        expect(partOneResult).toBe(17095);
    });

    it('solves part two', () => {
        const partTwoResult = partTwo();
        expect(partTwoResult).toBe(168794698570517);
    });
});

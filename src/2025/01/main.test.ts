import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2025/01', () => {
    it('solves part one', () => {
        const partOneResult = partOne();
        expect(partOneResult).toBe(1064);
    });

    it('solves part two', () => {
        const partTwoResult = partTwo();
        expect(partTwoResult).toBe(6122);
    });
});

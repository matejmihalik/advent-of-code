import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2015/20', () => {
    it('solves part one', () => {
        const partOneResult = partOne();
        expect(partOneResult).toBe(831600);
    });

    it('solves part two', () => {
        const partTwoResult = partTwo();
        expect(partTwoResult).toBe(884520);
    });
});

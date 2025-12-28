import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2015/15', () => {
    it('solves part one', () => {
        const partOneResult = partOne();
        expect(partOneResult).toBe(21367368);
    });

    it('solves part two', () => {
        const partTwoResult = partTwo();
        expect(partTwoResult).toBe(1766400);
    });
});

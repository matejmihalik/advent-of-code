import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2015/07', () => {
    it('solves part one', () => {
        const partOneResult = partOne();
        expect(partOneResult).toBe(3176);
    });

    it('solves part two', () => {
        const partTwoResult = partTwo();
        expect(partTwoResult).toBe(14710);
    });
});

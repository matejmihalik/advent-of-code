import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2015/08', () => {
    it('solves part one', () => {
        const partOneResult = partOne();
        expect(partOneResult).toBe(1371);
    });

    it('solves part two', () => {
        const partTwoResult = partTwo();
        expect(partTwoResult).toBe(2117);
    });
});

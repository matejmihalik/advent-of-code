import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2015/12', () => {
    it('solves part one', () => {
        const partOneResult = partOne();
        expect(partOneResult).toBe(156366);
    });

    it('solves part two', () => {
        const partTwoResult = partTwo();
        expect(partTwoResult).toBe(96852);
    });
});

import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2015/10', () => {
    it('solves part one', () => {
        const partOneResult = partOne();
        expect(partOneResult).toBe(329356);
    });

    it('solves part two', () => {
        const partTwoResult = partTwo();
        expect(partTwoResult).toBe(4666278);
    });
});

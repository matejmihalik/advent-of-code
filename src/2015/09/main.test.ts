import { describe, expect, it } from 'bun:test';
import { partOne, partTwo } from './main';

describe('2015/09', () => {
    it('solves part one', () => {
        const partOneResult = partOne();
        expect(partOneResult).toBe(251);
    });

    it('solves part two', () => {
        const partTwoResult = partTwo();
        expect(partTwoResult).toBe(898);
    });
});

import { describe, expect, it } from 'vitest';
import { partOne } from './main.ts';

describe('2015/25', () => {
    it('solves the first part', () => {
        const firstSolution = partOne();
        expect(firstSolution).toBe(2650453);
    });
});

// --- Day 2: Gift Shop ---
// https://adventofcode.com/2025/day/2
// https://www.reddit.com/r/adventofcode/comments/1pbzqcx/2025_day_2_solutions

import { InputReader } from '#src/input';

type Range = [start: number, end: number];

const RANGE_SEPARATOR = '-';

function parseRange(range: string): Range {
    const [start, end] = range.split(RANGE_SEPARATOR).map(Number);
    return [start, end];
}

const RANGES = new InputReader(import.meta.dirname).readAsComaSeparatedValues(parseRange);

function sumInvalidIds(validateId: (id: number) => boolean): number {
    return RANGES.reduce((totalInvalidIdSum, [start, end]) => {
        let currentRangeInvalidIdSum = 0;

        for (let id = start; id <= end; id++) {
            if (!validateId(id)) {
                currentRangeInvalidIdSum += id;
            }
        }

        return totalInvalidIdSum + currentRangeInvalidIdSum;
    }, 0);
}

export function partOne(): number {
    return sumInvalidIds((id) => {
        const stringId = String(id);
        const idLength = stringId.length;

        if (idLength % 2) {
            return true;
        }

        return stringId.slice(0, idLength / 2) !== stringId.slice(idLength / 2);
    });
}

export function partTwo(): number {
    return sumInvalidIds((id) => {
        const stringId = String(id);
        return !/^(?<pattern>\d+)\k<pattern>+$/.test(stringId);
    });
}

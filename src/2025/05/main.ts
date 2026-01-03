// --- Day 5: Cafeteria ---
// https://adventofcode.com/2025/day/5
// https://www.reddit.com/r/adventofcode/comments/1pemdwd/2025_day_5_solutions

import { InputReader } from '#src/input';

type Range = [start: number, end: number];

const [
    FRESH_RANGES_SECTION,
    AVAILABLE_IDS_SECTION,
] = new InputReader(import.meta.dirname).readAsSections();

function parseRange(range: string): Range {
    const [start, end] = range.split('-').map(Number);
    return [start, end];
}

const FRESH_RANGES = FRESH_RANGES_SECTION.readAsLines(parseRange);

const AVAILABLE_IDS = AVAILABLE_IDS_SECTION.readAsNumbers();

export function partOne(): number {
    return AVAILABLE_IDS.reduce((totalFreshIds, currentId) => {
        const isIdFresh = FRESH_RANGES.some(([start, end]) =>
            currentId >= start && currentId <= end,
        );

        return totalFreshIds + Number(isIdFresh);
    }, 0);
}

function findFirstOverlappingRangeIndex(
    [currentRangeStart, currentRangeEnd]: Range,
    availableRanges: Range[],
): number {
    return availableRanges.findIndex(([availableRangeStart, availableRangeEnd]) =>
        (currentRangeStart >= availableRangeStart && currentRangeStart <= availableRangeEnd)
        || (currentRangeEnd <= availableRangeEnd && currentRangeEnd >= availableRangeStart)
        || (currentRangeStart <= availableRangeStart && currentRangeEnd >= availableRangeEnd),
    );
}

function mergeRanges(ranges: Range[]): Range[] {
    return ranges.reduce<Range[]>((mergedRanges, currentRange) => {
        const overlappingRangeIndex = findFirstOverlappingRangeIndex(currentRange, mergedRanges);

        if (overlappingRangeIndex === -1) {
            mergedRanges.push(currentRange);
            return mergedRanges;
        }

        const overlappingRange = mergedRanges[overlappingRangeIndex];
        const extendedRange: Range = [
            Math.min(currentRange[0], overlappingRange[0]),
            Math.max(currentRange[1], overlappingRange[1]),
        ];

        if (extendedRange[0] !== overlappingRange[0] || extendedRange[1] !== overlappingRange[1]) {
            return mergeRanges(mergedRanges.toSpliced(overlappingRangeIndex, 1, extendedRange));
        }

        return mergedRanges;
    }, []);
}

export function partTwo(): number {
    const mergedRanges = mergeRanges(FRESH_RANGES);
    return mergedRanges.reduce((totalFreshIds, [start, end]) =>
        totalFreshIds + end - start + 1,
    0);
}

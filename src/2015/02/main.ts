// --- Day 2: I Was Told There Would Be No Math ---
// https://adventofcode.com/2015/day/2

import { InputReader } from '#src/InputReader.ts';

const GIFTS = new InputReader(import.meta.url).readAsLines();

const DIMENSION_SEPARATOR = 'x';

export function partOne(): number {
    return GIFTS.reduce((totalPaperArea, gift) => {
        const [length, width, height] = gift
            .split(DIMENSION_SEPARATOR)
            .map((dimension) => Number(dimension));

        const sideAreas = [length * width, length * height, width * height];
        const areaPaper = sideAreas.reduce(
            (accumulatedArea, sideArea) => accumulatedArea + sideArea * 2,
            0,
        );
        const sparePaper = Math.min(...sideAreas);

        return totalPaperArea + areaPaper + sparePaper;
    }, 0);
}

export function partTwo(): number {
    return GIFTS.reduce((totalRibbonLength, gift) => {
        const dimensions = gift.split(DIMENSION_SEPARATOR).map((dimension) => Number(dimension));
        const [, ...smallestDimensions] = dimensions.sort((a, b) => b - a);

        const ribbonLength = smallestDimensions.reduce(
            (accumulatedLength, dimension) => accumulatedLength + dimension * 2,
            0,
        );
        const bowLength = dimensions.reduce(
            (accumulatedLength, dimension) => accumulatedLength * dimension,
            1,
        );

        return totalRibbonLength + ribbonLength + bowLength;
    }, 0);
}

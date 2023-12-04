// --- Day 2: I Was Told There Would Be No Math ---
// https://adventofcode.com/2015/day/2

import { InputReader } from '#src/InputReader.ts';

const GIFTS = new InputReader(import.meta.url).readAsLines();

const DIMENSION_SEPARATOR = 'x';

function parseGiftDimensions(gift: string): number[] {
    return gift.split(DIMENSION_SEPARATOR).map((dimension) => Number(dimension));
}

function calculateWrappingPaperNeeded(gift: string): number {
    const [length, width, height] = parseGiftDimensions(gift);

    const sideAreas = [length * width, length * height, width * height];
    const areaPaper = sideAreas.reduce(
        (accumulatedArea, sideArea) => accumulatedArea + sideArea * 2,
        0,
    );
    const sparePaper = Math.min(...sideAreas);

    return areaPaper + sparePaper;
}

export function partOne(): number {
    return GIFTS.reduce((totalPaperNeeded, gift) => {
        const wrappingPaperForGift = calculateWrappingPaperNeeded(gift);
        return totalPaperNeeded + wrappingPaperForGift;
    }, 0);
}

function calculateRibbonLengthNeeded(gift: string): number {
    const dimensions = parseGiftDimensions(gift);
    const [, ...smallerDimensions] = dimensions.sort((a, b) => b - a);

    const ribbonLength = smallerDimensions.reduce(
        (accumulatedLength, dimension) => accumulatedLength + dimension * 2,
        0,
    );
    const bowLength = dimensions.reduce(
        (accumulatedLength, dimension) => accumulatedLength * dimension,
        1,
    );

    return ribbonLength + bowLength;
}

export function partTwo(): number {
    return GIFTS.reduce((totalRibbonNeeded, gift) => {
        const ribbonLengthForGift = calculateRibbonLengthNeeded(gift);
        return totalRibbonNeeded + ribbonLengthForGift;
    }, 0);
}

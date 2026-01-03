// --- Day 2: I Was Told There Would Be No Math ---
// https://adventofcode.com/2015/day/2
// https://www.reddit.com/r/adventofcode/comments/3v3w2f/day_2_solutions

import { InputReader } from '#src/input';
import { descendingSort } from '#src/utils';

type Gift = [length: number, width: number, height: number];

const DIMENSION_SEPARATOR = 'x';

function parseGift(gift: string): Gift {
    const [length, width, height] = gift.split(DIMENSION_SEPARATOR).map(Number);
    return [length, width, height];
}

const GIFTS = new InputReader(import.meta.dirname).readAsLines(parseGift);

function calculatePaperNeeded([length, width, height]: Gift): number {
    const sideAreas = [length * width, length * height, width * height];

    const areaPaper = sideAreas.reduce((totalArea, sideArea) => totalArea + sideArea * 2, 0);
    const sparePaper = Math.min(...sideAreas);

    return areaPaper + sparePaper;
}

export function partOne(): number {
    return GIFTS.reduce((totalPaperNeeded, gift) => {
        const paperNeededForGift = calculatePaperNeeded(gift);
        return totalPaperNeeded + paperNeededForGift;
    }, 0);
}

function calculateRibbonNeeded(dimensions: Gift): number {
    const [, ...smallerDimensions] = dimensions.sort(descendingSort);

    const ribbonLength = smallerDimensions.reduce((totalLength, dimension) =>
        totalLength + dimension * 2,
    0);
    const bowLength = dimensions.reduce((totalLength, dimension) => totalLength * dimension, 1);

    return ribbonLength + bowLength;
}

export function partTwo(): number {
    return GIFTS.reduce((totalRibbonNeeded, gift) => {
        const ribbonNeededForGift = calculateRibbonNeeded(gift);
        return totalRibbonNeeded + ribbonNeededForGift;
    }, 0);
}

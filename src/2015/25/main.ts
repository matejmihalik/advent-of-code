// --- Day 25: Let It Snow ---
// https://adventofcode.com/2015/day/25

import { InputReader } from '#src/InputReader.ts';

const INSTRUCTIONS = new InputReader(import.meta.url).readAsString();

const INITIAL_CODE = 20151125;
const CODE_MULTIPLIER = 252533;
const CODE_DIVISOR = 33554393;

const [TARGET_ROW, TARGET_COLUMN] =
    INSTRUCTIONS.match(
        /^To continue, please consult the code grid in the manual. {2}Enter the code at row (\d+), column (\d+).$/,
    )
        ?.slice(-2)
        .map(Number) ?? [];

function calculateTargetCodeOrdinal(row: number, column: number): number {
    const lastFullyFilledDiagonal = row + column - 2;
    let codeCount = 0;

    for (let currentDiagonal = lastFullyFilledDiagonal; currentDiagonal > 0; currentDiagonal--) {
        codeCount += currentDiagonal;
    }

    return codeCount + column;
}

function generateCodeAtOrdinal(targetOrdinal: number): number {
    let currentCode = INITIAL_CODE;

    for (let currentOrdinal = 1; currentOrdinal < targetOrdinal; currentOrdinal++) {
        currentCode = (currentCode * CODE_MULTIPLIER) % CODE_DIVISOR;
    }

    return currentCode;
}

export function partOne(): number {
    const codeOrdinal = calculateTargetCodeOrdinal(TARGET_ROW, TARGET_COLUMN);
    return generateCodeAtOrdinal(codeOrdinal);
}

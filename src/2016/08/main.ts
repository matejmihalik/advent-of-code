// --- Day 8: Two-Factor Authentication ---
// https://adventofcode.com/2016/day/8

import { InputReader } from '#src/InputReader.ts';

const INSTRUCTIONS = new InputReader(import.meta.url).readAsLines();

type Screen = boolean[][];

const SCREEN_WIDTH = 50;
const SCREEN_HEIGHT = 6;

const SCREEN: Screen = Array(SCREEN_HEIGHT)
    .fill(null)
    .map(() => Array(SCREEN_WIDTH).fill(false));

function countLitPixels(screen: Screen): number {
    return screen.reduce(
        (totalLitPixels, currentRow) =>
            totalLitPixels +
            currentRow.reduce((rowLitPixels, pixel) => rowLitPixels + Number(pixel), 0),
        0,
    );
}

function rectangle(width: number, height: number): void {
    for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {
            SCREEN[row][column] = true;
        }
    }
}

function rotateRow(row: number, delta: number): void {
    const screenRow = SCREEN[row];
    const overflowPixels = screenRow.splice(-delta, delta);
    screenRow.unshift(...overflowPixels);
}

function copyScreen(): Screen {
    return SCREEN.reduce<Screen>((screen, currentRow) => [...screen, [...currentRow]], []);
}

function rotateColumn(column: number, delta: number): void {
    const previousScreen = copyScreen();

    SCREEN.forEach((currentRow, currentRowIndex) => {
        const sourceRow = (currentRowIndex - delta + SCREEN_HEIGHT) % SCREEN_HEIGHT;
        const shiftedPixel = previousScreen[sourceRow][column];
        currentRow.splice(column, 1, shiftedPixel);
    });
}

function executeInstruction(instruction: string): void {
    const rectangleMatch = instruction.match(/^rect (?<width>\d+)x(?<height>\d+)$/);

    if (rectangleMatch?.groups) {
        const { width, height } = rectangleMatch.groups;
        rectangle(Number(width), Number(height));
    }

    const rotateRowMatch = instruction.match(/^rotate row y=(?<row>\d+) by (?<delta>\d+)$/);

    if (rotateRowMatch?.groups) {
        const { row, delta } = rotateRowMatch.groups;
        rotateRow(Number(row), Number(delta));
    }

    const rotateColumnMatch = instruction.match(
        /^rotate column x=(?<column>\d+) by (?<delta>\d+)$/,
    );

    if (rotateColumnMatch?.groups) {
        const { column, delta } = rotateColumnMatch.groups;
        rotateColumn(Number(column), Number(delta));
    }
}

export function partOne(): number {
    INSTRUCTIONS.forEach(executeInstruction);
    return countLitPixels(SCREEN);
}

function visualizeScreen(): string {
    return SCREEN.reduce((visualizedScreen, row) => {
        const visualizedRow = row.map((pixel) => (pixel ? '#' : ' ')).join('');
        return `${visualizedScreen}\n${visualizedRow}`;
    }, '');
}

export function partTwo(): string {
    return visualizeScreen();
}

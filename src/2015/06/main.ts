// --- Day 6: Probably a Fire Hazard ---
// https://adventofcode.com/2015/day/6

import { InputReader } from '#src/InputReader.ts';

const INSTRUCTIONS = new InputReader(import.meta.url).readAsLines();

type LightGrid = number[][];

const LIGHT_STATE_ON = 1;
const LIGHT_STATE_OFF = 0;
const TURN_ON_OPERATION = 'turn on';
const TURN_OFF_OPERATION = 'turn off';
const TOGGLE_OPERATION = 'toggle';
const GRID_SIZE = 1000;

function createGrid(): LightGrid {
    return Array.from(Array(GRID_SIZE), () => Array(GRID_SIZE).fill(LIGHT_STATE_OFF));
}

function switchLights(
    grid: LightGrid,
    instruction: string,
    switchOperation: (bulbBrightness: number, operation: string) => number,
): void {
    const match = instruction.match(
        /^(?<operation>.*) (?<startRow>\d+),(?<startColumn>\d+) through (?<endRow>\d+),(?<endColumn>\d+)$/,
    );

    if (!match) {
        return;
    }

    const { groups: { operation, startRow, startColumn, endRow, endColumn } = {} } = match;

    for (let row = Number(startRow); row <= Number(endRow); row++) {
        for (let column = Number(startColumn); column <= Number(endColumn); column++) {
            grid[row][column] = switchOperation(grid[row][column], operation);
        }
    }
}

function countGridBrightness(grid: LightGrid): number {
    return grid.reduce(
        (totalBrightness, column) =>
            totalBrightness +
            column.reduce(
                (columnBrightness, bulbBrightness) => columnBrightness + bulbBrightness,
                0,
            ),
        0,
    );
}

export function partOne(): number {
    const grid = createGrid();

    INSTRUCTIONS.forEach((instruction) =>
        switchLights(grid, instruction, (bulbState, operation) => {
            if (operation === TURN_ON_OPERATION) {
                return LIGHT_STATE_ON;
            }

            if (operation === TURN_OFF_OPERATION) {
                return LIGHT_STATE_OFF;
            }

            if (operation === TOGGLE_OPERATION) {
                return Number(!bulbState);
            }

            return bulbState;
        }),
    );

    return countGridBrightness(grid);
}

export function partTwo(): number {
    const grid = createGrid();

    INSTRUCTIONS.forEach((instruction) =>
        switchLights(grid, instruction, (bulbBrightness, operation) => {
            if (operation === TURN_ON_OPERATION) {
                return bulbBrightness + 1;
            }

            if (operation === TURN_OFF_OPERATION) {
                return Math.max(bulbBrightness - 1, 0);
            }

            if (operation === TOGGLE_OPERATION) {
                return bulbBrightness + 2;
            }

            return bulbBrightness;
        }),
    );

    return countGridBrightness(grid);
}

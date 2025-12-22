// --- Day 6: Probably a Fire Hazard ---
// https://adventofcode.com/2015/day/6
// https://www.reddit.com/r/adventofcode/comments/3vmltn/day_6_solutions

import { InputReader } from '#src/input';

enum Operation {
    On = 'turn on',
    Off = 'turn off',
    Toggle = 'toggle',
}

enum LightState {
    On = 1,
    Off = 0,
}

type LightGrid = number[][];

interface Instruction {
    operation: Operation;
    startRow: number;
    startColumn: number;
    endRow: number;
    endColumn: number;
}

type LightSwitchFunction = (lightBrightness: number, operation: Operation) => number;

const GRID_SIZE = 1000;

function parseInstruction(instruction: string): Instruction {
    const [, operation, startRow, startColumn, endRow, endColumn] = instruction.match(
        /^(?<operation>.*) (?<startRow>\d+),(?<startColumn>\d+) through (?<endRow>\d+),(?<endColumn>\d+)$/,
    ) ?? [];

    return {
        operation: operation as Operation,
        startRow: Number(startRow),
        startColumn: Number(startColumn),
        endRow: Number(endRow),
        endColumn: Number(endColumn),
    };
}

const INSTRUCTIONS = new InputReader(import.meta.dirname).readAsLines(parseInstruction);

function createLightGrid(): LightGrid {
    return Array.from(Array(GRID_SIZE), () => Array(GRID_SIZE).fill(LightState.Off));
}

function switchLights(
    grid: LightGrid,
    { operation, startRow, startColumn, endRow, endColumn }: Instruction,
    lightSwitchFunction: LightSwitchFunction,
): void {
    for (let row = startRow; row <= endRow; row++) {
        for (let column = startColumn; column <= endColumn; column++) {
            grid[row][column] = lightSwitchFunction(grid[row][column], operation);
        }
    }
}

function sumLightGridBrightness(grid: LightGrid): number {
    return grid.reduce((totalBrightness, row) =>
        totalBrightness
        + row.reduce((rowBrightness, lightBrightness) => rowBrightness + lightBrightness, 0),
    0);
}

function lightUpGrid(lightSwitchFunction: LightSwitchFunction): number {
    const lightGrid = createLightGrid();

    INSTRUCTIONS.forEach((instruction) =>
        switchLights(lightGrid, instruction, lightSwitchFunction),
    );

    return sumLightGridBrightness(lightGrid);
}

export function partOne(): number {
    return lightUpGrid((lightState, operation) => {
        if (operation === Operation.On) {
            return LightState.On;
        }

        if (operation === Operation.Off) {
            return LightState.Off;
        }

        if (operation === Operation.Toggle) {
            return Number(!lightState);
        }

        return lightState;
    });
}

export function partTwo(): number {
    return lightUpGrid((lightBrightness, operation) => {
        if (operation === Operation.On) {
            return lightBrightness + 1;
        }

        if (operation === Operation.Off) {
            return Math.max(lightBrightness - 1, 0);
        }

        if (operation === Operation.Toggle) {
            return lightBrightness + 2;
        }

        return lightBrightness;
    });
}

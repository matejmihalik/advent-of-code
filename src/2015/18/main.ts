// --- Day 18: Like a GIF For Your Yard ---
// https://adventofcode.com/2015/day/18
// https://www.reddit.com/r/adventofcode/comments/3xb3cj/day_18_solutions

import { InputReader } from '#src/input';

enum LightState {
    On = '#',
    Off = '.',
}

type LightGrid = boolean[][];

type IsLightStuck = (row: number, column: number) => boolean;

const STEP_LIMIT = 100;

function parseGridCell(cell: string): boolean {
    return cell === LightState.On;
}

const INITIAL_GRID = new InputReader(import.meta.dirname).readAsGrid(parseGridCell);

function countActiveNeighbouringLights(grid: LightGrid, row: number, column: number): number {
    let activeNeighbouringLights = 0;

    for (let rowDelta = -1; rowDelta <= 1; rowDelta++) {
        for (let columnDelta = -1; columnDelta <= 1; columnDelta++) {
            if (rowDelta || columnDelta) {
                const neighbouringLight = Boolean(grid[row + rowDelta]?.[column + columnDelta]);
                activeNeighbouringLights += Number(neighbouringLight);
            }
        }
    }

    return activeNeighbouringLights;
}

function switchLight(grid: LightGrid, row: number, column: number): boolean {
    const isLightActive = grid[row][column];
    const activeNeighbouringLightCount = countActiveNeighbouringLights(grid, row, column);

    if (isLightActive) {
        return [2, 3].includes(activeNeighbouringLightCount);
    }

    return activeNeighbouringLightCount === 3;
}

function animateGridForOneStep(grid: LightGrid, isLightStuck?: IsLightStuck): LightGrid {
    return grid.map((row, rowIndex) =>
        row.map((lightState, columnIndex) => {
            if (isLightStuck?.(rowIndex, columnIndex)) {
                return lightState;
            }

            return switchLight(grid, rowIndex, columnIndex);
        }),
    );
}

function animateGrid(
    initialGrid: LightGrid,
    stepLimit: number,
    isLightStuck?: IsLightStuck,
): LightGrid {
    let grid = initialGrid;

    for (let iteration = 0; iteration < stepLimit; iteration++) {
        grid = animateGridForOneStep(grid, isLightStuck);
    }

    return grid;
}

function countActiveGridLights(grid: LightGrid): number {
    return grid.reduce((totalActiveLights, currentRow) =>
        totalActiveLights
        + currentRow.reduce((rowActiveLights, light) => rowActiveLights + Number(light), 0),
    0);
}

function countActiveLightsAfterAnimation(
    initialGrid: LightGrid,
    isLightStuck?: IsLightStuck,
): number {
    const finalGrid = animateGrid(initialGrid, STEP_LIMIT, isLightStuck);
    return countActiveGridLights(finalGrid);
}

export function partOne(): number {
    return countActiveLightsAfterAnimation(INITIAL_GRID);
}

const isLightStuck: IsLightStuck = (row, column) => {
    const gridHeight = INITIAL_GRID.length;
    const gridWidth = INITIAL_GRID[0].length;

    return (row === 0 || row === gridHeight - 1) && (column === 0 || column === gridWidth - 1);
};

export function partTwo(): number {
    const initialGrid = INITIAL_GRID.map((row, rowIndex) =>
        row.map((lightState, columnIndex) => isLightStuck(rowIndex, columnIndex) || lightState),
    );

    return countActiveLightsAfterAnimation(initialGrid, isLightStuck);
}

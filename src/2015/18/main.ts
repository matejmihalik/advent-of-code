// --- Day 18: Like a GIF For Your Yard ---
// https://adventofcode.com/2015/day/18

import { InputReader } from '#src/InputReader.ts';

const INITIAL_GRID_STATE = new InputReader(import.meta.url).readAsLines();

type LightGrid = boolean[][];

type LightCoordinates = [row: number, column: number];

const STEP_LIMIT = 100;
const LIGHT_STATE_ON_SYMBOL = '#';

const INITIAL_GRID: LightGrid = INITIAL_GRID_STATE.map((gridRow) =>
    gridRow.split('').map((symbol) => symbol === LIGHT_STATE_ON_SYMBOL),
);

function countActiveNeighbouringLights(
    lightGrid: LightGrid,
    [rowPosition, columnPosition]: LightCoordinates,
): number {
    let activeNeighbouringLights = 0;

    for (let rowDelta = -1; rowDelta <= 1; rowDelta++) {
        for (let columnDelta = -1; columnDelta <= 1; columnDelta++) {
            const neighbouringLight =
                !!lightGrid[rowPosition + rowDelta]?.[columnPosition + columnDelta];
            activeNeighbouringLights += Number(neighbouringLight);
        }
    }

    const centerLight = lightGrid[rowPosition][columnPosition];
    activeNeighbouringLights -= Number(centerLight);

    return activeNeighbouringLights;
}

function switchLight(
    lightGrid: LightGrid,
    [rowPosition, columnPosition]: LightCoordinates,
): boolean {
    const isLightActive = lightGrid[rowPosition][columnPosition];
    const activeNeighbouringLightCount = countActiveNeighbouringLights(lightGrid, [
        rowPosition,
        columnPosition,
    ]);

    if (isLightActive) {
        return [2, 3].includes(activeNeighbouringLightCount);
    }

    return activeNeighbouringLightCount === 3;
}

function isLightStuck(light: LightCoordinates, stuckLights: LightCoordinates[]): boolean {
    const serializedStuckLights = stuckLights.map((lightCoordinates) =>
        lightCoordinates.toString(),
    );

    return serializedStuckLights.includes(light.toString());
}

function animateGrid(lightGrid: LightGrid, stuckLights: LightCoordinates[]): LightGrid {
    return lightGrid.map((gridRow, rowIndex) =>
        gridRow.map((currentLight, columnIndex) => {
            if (isLightStuck([rowIndex, columnIndex], stuckLights)) {
                return currentLight;
            }

            return switchLight(lightGrid, [rowIndex, columnIndex]);
        }),
    );
}

function animateGridForNSteps(
    initialGrid: LightGrid,
    stepLimit: number,
    stuckLights: LightCoordinates[] = [],
): LightGrid {
    let currentGrid = initialGrid;

    for (let iteration = 0; iteration < stepLimit; iteration++) {
        currentGrid = animateGrid(currentGrid, stuckLights);
    }

    return currentGrid;
}

function countActiveGridLights(lightGrid: LightGrid): number {
    return lightGrid.reduce(
        (totalActiveLights, currentRow) =>
            totalActiveLights +
            currentRow.reduce((rowActiveLights, light) => rowActiveLights + Number(light), 0),
        0,
    );
}

export function partOne(): number {
    const finalGrid = animateGridForNSteps(INITIAL_GRID, STEP_LIMIT);
    return countActiveGridLights(finalGrid);
}

function getGridCornerLights(grid: LightGrid): LightCoordinates[] {
    const gridHeight = grid.length;
    const gridLength = grid[0].length;

    return [
        [0, 0],
        [0, gridLength - 1],
        [gridHeight - 1, 0],
        [gridHeight - 1, gridLength - 1],
    ];
}

export function partTwo(): number {
    const initialGrid = INITIAL_GRID;

    const stuckLights = getGridCornerLights(INITIAL_GRID);
    stuckLights.forEach(([lightRow, lightColumn]) => {
        initialGrid[lightRow][lightColumn] = true;
    });

    const finalGrid = animateGridForNSteps(initialGrid, STEP_LIMIT, stuckLights);

    return countActiveGridLights(finalGrid);
}

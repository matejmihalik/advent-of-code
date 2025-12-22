// --- Day 4: Printing Department ---
// https://adventofcode.com/2025/day/4
// https://www.reddit.com/r/adventofcode/comments/1pdr8x6/2025_day_4_solutions

import { InputReader } from '#src/input';

type Grid = boolean[][];

const ROLL_SYMBOL = '@';
const ACCESSIBLE_ROLL_THRESHOLD = 3;

function parseCell(cell: string): boolean {
    return cell === ROLL_SYMBOL;
}

const GRID = new InputReader(import.meta.dirname).readAsGrid(parseCell);

function countNeighbouringRolls(grid: Grid, row: number, column: number): number {
    let neighbouringRolls = 0;

    for (let rowDelta = -1; rowDelta <= 1; rowDelta++) {
        for (let columnDelta = -1; columnDelta <= 1; columnDelta++) {
            if (rowDelta || columnDelta) {
                const neighbouringCell = grid[row + rowDelta]?.[column + columnDelta] ?? false;
                neighbouringRolls += Number(neighbouringCell);
            }
        }
    }

    return neighbouringRolls;
}

function countAccessibleRolls(grid: Grid, removeAccessibleRolls = false): number {
    return grid.reduce((totalAccessibleRolls, row, rowIndex) =>
        totalAccessibleRolls
        + row.reduce((rowAccessibleRolls, cell, columnIndex) => {
            const isAccessibleRoll = cell
                && countNeighbouringRolls(grid, rowIndex, columnIndex) <= ACCESSIBLE_ROLL_THRESHOLD;

            if (isAccessibleRoll && removeAccessibleRolls) {
                grid[rowIndex][columnIndex] = false;
            }

            return rowAccessibleRolls + Number(isAccessibleRoll);
        }, 0),
    0);
}

export function partOne(): number {
    return countAccessibleRolls(GRID);
}

export function partTwo(): number {
    const grid = GRID.map((row) => row.slice());
    let totalRemovedRolls = 0;
    let currentRemovedRolls = 0;

    do {
        currentRemovedRolls = countAccessibleRolls(grid, true);
        totalRemovedRolls += currentRemovedRolls;
    } while (currentRemovedRolls > 0);

    return totalRemovedRolls;
}

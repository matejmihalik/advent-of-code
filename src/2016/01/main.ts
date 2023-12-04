// --- Day 1: No Time for a Taxicab ---
// https://adventofcode.com/2016/day/1

import { InputReader } from '#src/InputReader.ts';

const RAW_INSTRUCTIONS = new InputReader(import.meta.url).readAsComaSeparatedValues();

type Turn = 'L' | 'R';

interface Instruction {
    turn: Turn;
    distance: number;
}

type Direction = 'north' | 'south' | 'west' | 'east';

type Position = [row: number, column: number];

type Move = [Position, Position];

const STARTING_POSITION: Position = [0, 0];

const DIRECTIONS: Direction[] = ['north', 'east', 'south', 'west'];

const INSTRUCTIONS = RAW_INSTRUCTIONS.reduce<Instruction[]>(
    (processedInstructions, currentInstruction) => {
        const currentInstructionMatch = currentInstruction.match(/^(?<turn>[LR])(?<distance>\d+)$/);

        if (!currentInstructionMatch?.groups) {
            return processedInstructions;
        }

        const { turn, distance } = currentInstructionMatch.groups;

        processedInstructions.push({ turn, distance: Number(distance) } as Instruction);

        return processedInstructions;
    },
    [],
);

function changeDirection(currentDirection: Direction, turn: Turn): Direction {
    const currentDirectionIndex = DIRECTIONS.indexOf(currentDirection);
    const directionIndexDelta = turn === 'L' ? -1 : 1;
    const newDirectionIndex =
        (currentDirectionIndex + directionIndexDelta + DIRECTIONS.length) % DIRECTIONS.length;

    return DIRECTIONS[newDirectionIndex];
}

function move(
    [startingPositionRow, startingPositionColumn]: Position,
    direction: Direction,
    distance: number,
): Position {
    switch (direction) {
        case 'north':
            return [startingPositionRow + distance, startingPositionColumn];
        case 'south':
            return [startingPositionRow - distance, startingPositionColumn];
        case 'west':
            return [startingPositionRow, startingPositionColumn - distance];
        case 'east':
            return [startingPositionRow, startingPositionColumn + distance];
        default:
            return [startingPositionRow, startingPositionColumn];
    }
}

function followInstructionsToFinalDestination(
    startingPosition: Position,
    instructions: Instruction[],
): Position {
    let currentDirection: Direction = 'north';
    let currentPosition: Position = startingPosition;

    instructions.forEach(({ turn, distance }) => {
        currentDirection = changeDirection(currentDirection, turn);
        currentPosition = move(currentPosition, currentDirection, distance);
    });

    return currentPosition;
}

function calculateDistanceBetweenPositions(
    [startingPositionRow, startingPositionColumn]: Position,
    [finalPositionRow, finalPositionColumn]: Position,
): number {
    return (
        Math.abs(startingPositionRow - finalPositionRow) +
        Math.abs(startingPositionColumn - finalPositionColumn)
    );
}

export function partOne(): number {
    const finalPosition = followInstructionsToFinalDestination(STARTING_POSITION, INSTRUCTIONS);
    return calculateDistanceBetweenPositions(STARTING_POSITION, finalPosition);
}

function arePositionsEqual([rowA, columnA]: Position, [rowB, columnB]: Position): boolean {
    return rowA === rowB && columnA === columnB;
}

function findMoveIntersection(
    [[startingRowA, startingColumnA], [finalRowA, finalColumnA]]: Move,
    [[startingRowB, startingColumnB], [finalRowB, finalColumnB]]: Move,
): Position | undefined {
    const rowDeltaA = finalRowA - startingRowA;
    const columnDeltaA = finalColumnA - startingColumnA;
    const rowDeltaB = finalRowB - startingRowB;
    const columnDeltaB = finalColumnB - startingColumnB;

    const curveA =
        (-columnDeltaA * (startingRowA - startingRowB) +
            rowDeltaA * (startingColumnA - startingColumnB)) /
        (-rowDeltaB * columnDeltaA + rowDeltaA * columnDeltaB);
    const curveB =
        (rowDeltaB * (startingColumnA - startingColumnB) -
            columnDeltaB * (startingRowA - startingRowB)) /
        (-rowDeltaB * columnDeltaA + rowDeltaA * columnDeltaB);

    if (curveA >= 0 && curveA <= 1 && curveB >= 0 && curveB <= 1) {
        return [startingRowA + curveB * rowDeltaA, startingColumnA + curveB * columnDeltaA];
    }

    return undefined;
}

function findIntersectionPointOnPath(currentMove: Move, path: Move[]): Position | undefined {
    let firstIntersectionPoint: Position | undefined;

    path.some((previousMove) => {
        if (arePositionsEqual(currentMove[0], previousMove[1])) {
            return false;
        }

        const intersectionPoint = findMoveIntersection(currentMove, previousMove);

        if (intersectionPoint) {
            firstIntersectionPoint = intersectionPoint;
            return true;
        }

        return false;
    });

    return firstIntersectionPoint;
}

function followInstructionsToFirstRepeatedDestination(
    startingPosition: Position,
    instructions: Instruction[],
): Position | undefined {
    let firstRepeatedDestination: Position | undefined;
    const movesTaken: Move[] = [];

    let currentDirection: Direction = 'north';
    let currentPosition: Position = startingPosition;

    instructions.some(({ turn, distance }) => {
        const previousPosition = currentPosition;

        currentDirection = changeDirection(currentDirection, turn);
        currentPosition = move(currentPosition, currentDirection, distance);

        const currentMove: Move = [previousPosition, currentPosition];
        const intersectionPoint = findIntersectionPointOnPath(currentMove, movesTaken);

        if (intersectionPoint) {
            firstRepeatedDestination = intersectionPoint;
            return true;
        }

        movesTaken.push(currentMove);

        return false;
    });

    return firstRepeatedDestination;
}

export function partTwo(): number {
    const firstRepeatedPosition = followInstructionsToFirstRepeatedDestination(
        STARTING_POSITION,
        INSTRUCTIONS,
    );

    if (!firstRepeatedPosition) {
        return 0;
    }

    return calculateDistanceBetweenPositions(STARTING_POSITION, firstRepeatedPosition);
}

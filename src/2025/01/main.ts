// --- Day 1: Secret Entrance ---
// https://adventofcode.com/2025/day/1
// https://www.reddit.com/r/adventofcode/comments/1pb3y8p/2025_day_1_solutions

import { InputReader } from '#src/input';

enum Direction {
    Left = 'L',
    Right = 'R',
}

const DIAL_SIZE = 100;
const INITIAL_DIAL_POSITION = 50;

function getDirectionModifier(direction: Direction): number {
    if (direction === Direction.Left) {
        return -1;
    }

    if (direction === Direction.Right) {
        return 1;
    }

    return 0;
}

function parseRotation(rotation: string): number {
    const [, direction, distance] = rotation.match(/^(?<direction>[LR])(?<distance>\d+)$/) ?? [];
    return Number(distance) * getDirectionModifier(direction as Direction);
}

const ROTATIONS = new InputReader(import.meta.dirname).readAsLines(parseRotation);

function rotateDial(dialPosition: number, rotation: number): number {
    let updatedDialPosition = (dialPosition + rotation) % DIAL_SIZE;

    if (updatedDialPosition < 0) {
        updatedDialPosition = DIAL_SIZE + updatedDialPosition;
    }

    return updatedDialPosition;
}

export function partOne(): number {
    let dialPosition = INITIAL_DIAL_POSITION;

    return ROTATIONS.reduce((zeroHits, rotation) => {
        dialPosition = rotateDial(dialPosition, rotation);

        if (dialPosition === 0) {
            return zeroHits + 1;
        }

        return zeroHits;
    }, 0);
}

function countZeroClicksForRotation(
    originalDialPosition: number,
    updatedDialPosition: number,
    rotation: number,
) {
    const currentZeroClicks = Math.floor(Math.abs(rotation) / DIAL_SIZE);

    if (originalDialPosition === 0) {
        return currentZeroClicks;
    }

    if (updatedDialPosition === 0) {
        return currentZeroClicks + 1;
    }

    if (rotation < 0 && updatedDialPosition > originalDialPosition) {
        return currentZeroClicks + 1;
    }

    if (rotation > 0 && updatedDialPosition < originalDialPosition) {
        return currentZeroClicks + 1;
    }

    return currentZeroClicks;
}

export function partTwo(): number {
    let dialPosition = INITIAL_DIAL_POSITION;

    return ROTATIONS.reduce((totalZeroClick, rotation) => {
        const originalDialPosition = dialPosition;
        dialPosition = rotateDial(dialPosition, rotation);

        const zeroClicksForRotation = countZeroClicksForRotation(
            originalDialPosition,
            dialPosition,
            rotation,
        );

        return totalZeroClick + zeroClicksForRotation;
    }, 0);
}

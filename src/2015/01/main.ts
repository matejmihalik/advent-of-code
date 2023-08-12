// --- Day 1: Not Quite Lisp ---
// https://adventofcode.com/2015/day/1

import { InputReader } from '#src/InputReader.ts';

const INSTRUCTIONS = new InputReader(import.meta.url).readAsChars();

const STARTING_FLOOR = 0;
const GO_UP_INSTRUCTION = '(';
const GO_DOWN_INSTRUCTION = ')';

function move(currentFloor: number, instruction: string): number {
    if (instruction === GO_UP_INSTRUCTION) {
        return currentFloor + 1;
    }

    if (instruction === GO_DOWN_INSTRUCTION) {
        return currentFloor - 1;
    }

    return currentFloor;
}

export function partOne(): number {
    return INSTRUCTIONS.reduce(move, STARTING_FLOOR);
}

export function partTwo(): number {
    let currentFloor = STARTING_FLOOR;

    const firstBasementEntryIndex = INSTRUCTIONS.findIndex((instruction) => {
        currentFloor = move(currentFloor, instruction);
        return currentFloor < STARTING_FLOOR;
    });

    return firstBasementEntryIndex + 1;
}

// --- Day 1: Not Quite Lisp ---
// https://adventofcode.com/2015/day/1
// https://www.reddit.com/r/programming/comments/3uyl7s/daily_programming_puzzles_at_advent_of_code

import { InputReader } from '#src/input';

enum Instruction {
    Up = '(',
    Down = ')',
}

const GROUND_FLOOR = 0;

const INSTRUCTIONS = new InputReader(import.meta.dirname).readAsChars<Instruction>();

function moveSanta(currentFloor: number, instruction: Instruction): number {
    if (instruction === Instruction.Up) {
        return currentFloor + 1;
    }

    if (instruction === Instruction.Down) {
        return currentFloor - 1;
    }

    return currentFloor;
}

export function partOne(): number {
    return INSTRUCTIONS.reduce(moveSanta, GROUND_FLOOR);
}

export function partTwo(): number {
    let currentFloor = GROUND_FLOOR;

    const firstBasementEntryIndex = INSTRUCTIONS.findIndex((instruction) => {
        currentFloor = moveSanta(currentFloor, instruction);
        return currentFloor < GROUND_FLOOR;
    });

    return firstBasementEntryIndex + 1;
}

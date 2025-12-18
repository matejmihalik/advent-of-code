// --- Day 3: Perfectly Spherical Houses in a Vacuum ---
// https://adventofcode.com/2015/day/3
// https://www.reddit.com/r/adventofcode/comments/3v8roh/day_3_solutions

import { InputReader } from '#src/input';
import { pairSigned, partition } from '#src/utils';

enum Instruction {
    Up = '^',
    Down = 'v',
    Left = '<',
    Right = '>',
}

type House = [row: number, column: number];

const STARTING_HOUSE: House = [0, 0];

const INSTRUCTIONS = new InputReader(import.meta.dirname).readAsChars<Instruction>();

function moveSanta([row, column]: House, instruction: Instruction): House {
    if (instruction === Instruction.Up) {
        return [row + 1, column];
    }

    if (instruction === Instruction.Down) {
        return [row - 1, column];
    }

    if (instruction === Instruction.Left) {
        return [row, column - 1];
    }

    if (instruction === Instruction.Right) {
        return [row, column + 1];
    }

    return [row, column];
}

function deliverPresents(instructions: Instruction[]): Set<number> {
    let currentHouse = STARTING_HOUSE;

    return instructions.reduce((visitedHouses, instruction) => {
        currentHouse = moveSanta(currentHouse, instruction);
        return visitedHouses.add(pairSigned(currentHouse));
    }, new Set<number>([pairSigned(STARTING_HOUSE)]));
}

export function partOne(): number {
    return deliverPresents(INSTRUCTIONS).size;
}

export function partTwo(): number {
    const [instructionsForRobot, instructionsForSanta] = partition(
        INSTRUCTIONS,
        (_, instructionIndex) => Boolean(instructionIndex % 2),
    );

    const housesVisitedBySanta = deliverPresents(instructionsForSanta);
    const housesVisitedByRobot = deliverPresents(instructionsForRobot);

    return housesVisitedBySanta.union(housesVisitedByRobot).size;
}

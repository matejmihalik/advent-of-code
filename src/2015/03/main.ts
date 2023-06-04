// --- Day 3: Perfectly Spherical Houses in a Vacuum ---
// https://adventofcode.com/2015/day/3

import { InputReader } from '#src/InputReader.ts';

const inputReader = new InputReader(import.meta.url);
const instructions = inputReader.readAsChars();

type House = [number, number];

const STARTING_HOUSE: House = [0, 0];
const GO_UP_INSTRUCTION = '^';
const GO_DOWN_INSTRUCTION = 'v';
const GO_LEFT_INSTRUCTION = '<';
const GO_RIGHT_INSTRUCTION = '>';

function partition<T>(array: T[], predicate: (item: T, index: number) => boolean): [T[], T[]] {
    return array.reduce<[T[], T[]]>(
        ([truthyResults, falsyResults], item, index) => {
            if (predicate(item, index)) {
                truthyResults.push(item);
            } else {
                falsyResults.push(item);
            }

            return [truthyResults, falsyResults];
        },
        [[], []],
    );
}

function move([currentHouseX, currentHouseY]: House, instruction: string): House {
    if (instruction === GO_UP_INSTRUCTION) {
        return [currentHouseX, currentHouseY + 1];
    }

    if (instruction === GO_DOWN_INSTRUCTION) {
        return [currentHouseX, currentHouseY - 1];
    }

    if (instruction === GO_LEFT_INSTRUCTION) {
        return [currentHouseX - 1, currentHouseY];
    }

    if (instruction === GO_RIGHT_INSTRUCTION) {
        return [currentHouseX + 1, currentHouseY];
    }

    return [currentHouseX, currentHouseY];
}

function deliver(deliveryInstructions: string[]): Set<string> {
    let currentHouse = STARTING_HOUSE;
    return deliveryInstructions.reduce((visitedHouses, instruction) => {
        currentHouse = move(currentHouse, instruction);
        return visitedHouses.add(currentHouse.toString());
    }, new Set([STARTING_HOUSE.toString()]));
}

export function partOne(): number {
    return deliver(instructions).size;
}

export function partTwo(): number {
    const [instructionsForRobot, instructionsForSanta] = partition(
        instructions,
        (instruction, index) => Boolean(index % 2),
    );

    const housesVisitedBySanta = deliver(instructionsForSanta);
    const housesVisitedByRobot = deliver(instructionsForRobot);

    return new Set([...housesVisitedBySanta, ...housesVisitedByRobot]).size;
}

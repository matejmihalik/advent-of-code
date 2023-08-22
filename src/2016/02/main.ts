// --- Day 2: Bathroom Security ---
// https://adventofcode.com/2016/day/2

import { InputReader } from '#src/InputReader.ts';

const INSTRUCTIONS = new InputReader(import.meta.url).readAsLines();

type Move = 'U' | 'D' | 'L' | 'R';

type KeyPosition = [number, number];

type Keypad = string[][];

const INITIAL_KEY = '5';

function geKeyPosition(key: string, keypad: Keypad): KeyPosition | undefined {
    const keypadRow = keypad.find((rowDigits) => rowDigits.includes(key));

    if (!keypadRow) {
        return undefined;
    }

    const rowIndex = keypad.indexOf(keypadRow);
    const columnIndex = keypadRow.indexOf(key);

    return [rowIndex, columnIndex];
}

function moveOnKeypad([currentRow, currentColumn]: KeyPosition, move: Move): KeyPosition {
    switch (move) {
        case 'U':
            return [currentRow - 1, currentColumn];
        case 'D':
            return [currentRow + 1, currentColumn];
        case 'L':
            return [currentRow, currentColumn - 1];
        case 'R':
            return [currentRow, currentColumn + 1];
        default:
            return [currentRow, currentColumn];
    }
}

function getKeyOnPosition([row, column]: KeyPosition, keypad: Keypad): string | undefined {
    return keypad[row]?.[column];
}

function executeMovementSequence(initialKey: string, instructions: Move[], keypad: Keypad): string {
    let currentPosition = geKeyPosition(initialKey, keypad);

    if (!currentPosition) {
        return '';
    }

    instructions.forEach((move) => {
        const newPosition = moveOnKeypad(currentPosition as KeyPosition, move);

        if (getKeyOnPosition(newPosition, keypad)) {
            currentPosition = newPosition;
        }
    });

    return getKeyOnPosition(currentPosition, keypad) ?? '';
}

function findCode(instructions: string[], keypad: Keypad): string {
    return instructions.reduce((partialCode, instructionsLine) => {
        const initialKey = partialCode.at(-1) || INITIAL_KEY;
        const currentInstructions = instructionsLine.split('') as Move[];
        const currentKey = executeMovementSequence(initialKey, currentInstructions, keypad);

        return partialCode + currentKey;
    }, '');
}

export function partOne(): string {
    const keypad = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
    ];

    return findCode(INSTRUCTIONS, keypad);
}

export function partTwo(): string {
    const keypad = [
        ['', '', '1', '', ''],
        ['', '2', '3', '4', ''],
        ['5', '6', '7', '8', '9'],
        ['', 'A', 'B', 'C', ''],
        ['', '', 'D', '', ''],
    ];

    return findCode(INSTRUCTIONS, keypad);
}

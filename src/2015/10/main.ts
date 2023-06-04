// --- Day 10: Elves Look, Elves Say ---
// https://adventofcode.com/2015/day/10

import { InputReader } from '#src/InputReader.ts';

const inputReader = new InputReader(import.meta.url);
const input = inputReader.readAsString();

function lookAndSay(sequence: string): string {
    const digitSequences = Array.from(sequence.match(/(?<digit>\d)\k<digit>*/g) ?? []);

    return digitSequences.reduce(
        (partialSequence, digitSequence) =>
            partialSequence + digitSequence.length + digitSequence[0],
        '',
    );
}

function playGame(numberOfTurns: number): string {
    let sequence = input;

    for (let turnNumber = 0; turnNumber < numberOfTurns; turnNumber++) {
        sequence = lookAndSay(sequence);
    }

    return sequence;
}

export function partOne(): number {
    const turnLimit = 40;
    return playGame(turnLimit).length;
}

export function partTwo(): number {
    const turnLimit = 50;
    return playGame(turnLimit).length;
}

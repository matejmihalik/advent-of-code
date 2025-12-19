// --- Day 10: Elves Look, Elves Say ---
// https://adventofcode.com/2015/day/10
// https://www.reddit.com/r/adventofcode/comments/3w6h3m/day_10_solutions

import { InputReader } from '#src/input';

const INITIAL_SEQUENCE = new InputReader(import.meta.dirname).readAsString();

function lookAndSay(sequence: string): string {
    const digitSequences = sequence.match(/(?<digit>\d)\k<digit>*/g) ?? [];

    return digitSequences.reduce((expandedSequence, digitSequence) =>
        expandedSequence + digitSequence.length + digitSequence[0],
    '');
}

function playGame(turnLimit: number): string {
    let sequence = INITIAL_SEQUENCE;

    for (let turnNumber = 0; turnNumber < turnLimit; turnNumber++) {
        sequence = lookAndSay(sequence);
    }

    return sequence;
}

export function partOne(): number {
    const turnLimit = 40;
    const finalSequence = playGame(turnLimit);

    return finalSequence.length;
}

export function partTwo(): number {
    const turnLimit = 50;
    const finalSequence = playGame(turnLimit);

    return finalSequence.length;
}

// --- Day 9: Mirage Maintenance ---
// https://adventofcode.com/2023/day/9

import { InputReader } from '#src/InputReader.ts';

const RAW_SEQUENCES = new InputReader(import.meta.url).readAsLines();

const HISTORY_SEQUENCES = RAW_SEQUENCES.map((rawSequence) => rawSequence.split(' ').map(Number));

function calculateDeltaSequence(sequence: number[]): number[] {
    return sequence.reduce<number[]>((deltaSequence, currentNumber, numberIndex) => {
        const followingNumber = sequence[numberIndex + 1];

        if (followingNumber !== undefined) {
            deltaSequence.push(followingNumber - currentNumber);
        }

        return deltaSequence;
    }, []);
}

function extrapolateNextValue(sequence: number[]): number {
    let currentSequence = sequence;
    const previousTrailingValues: number[] = [];

    while (currentSequence.some((number) => number)) {
        const deltaSequence = calculateDeltaSequence(currentSequence);
        previousTrailingValues.push(currentSequence.pop() ?? 0);
        currentSequence = deltaSequence;
    }

    return previousTrailingValues.reduce(
        (currentPrediction, currentTrailingValue) => currentTrailingValue + currentPrediction,
        0,
    );
}

export function partOne(): number {
    return HISTORY_SEQUENCES.reduce((sum, sequence) => sum + extrapolateNextValue(sequence), 0);
}

export function partTwo(): number {
    return HISTORY_SEQUENCES.reduce(
        (sum, sequence) => sum + extrapolateNextValue(sequence.reverse()),
        0,
    );
}

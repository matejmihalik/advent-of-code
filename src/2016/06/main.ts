// --- Day 6: Signals and Noise ---
// https://adventofcode.com/2016/day/6

import { InputReader } from '#src/InputReader.ts';

const MESSAGES = new InputReader(import.meta.url).readAsLines();

type Histogram = Map<string, number>;

function buildLetterHistogram(letters: string[]): Histogram {
    return letters.reduce((histogram, letter) => {
        const currentHits = histogram.get(letter) ?? 0;
        histogram.set(letter, currentHits + 1);

        return histogram;
    }, new Map<string, number>());
}

function buildColumnHistograms(messages: string[]): Histogram[] {
    const lettersColumns = messages.reduce<string[][]>((columns, message) => {
        message.split('').forEach((letter, letterPosition) => {
            columns[letterPosition] ??= [];
            columns[letterPosition].push(letter);
        });

        return columns;
    }, []);

    return lettersColumns.map(buildLetterHistogram);
}

function findMostFrequentLetter(histogram: Histogram): string {
    const [mostFrequentLetter] = Array.from(histogram.entries()).reduce(
        (mostFrequentEntry, currentEntry) => {
            if (currentEntry[1] > mostFrequentEntry[1]) {
                return currentEntry;
            }

            return mostFrequentEntry;
        },
        ['', 0],
    );

    return mostFrequentLetter;
}

export function partOne(): string {
    const columnHistograms = buildColumnHistograms(MESSAGES);
    const mostFrequentLetters = columnHistograms.map(findMostFrequentLetter);

    return mostFrequentLetters.join('');
}

function findLeastFrequentLetter(histogram: Histogram): string {
    const [leastFrequentLetter] = Array.from(histogram.entries()).reduce(
        (leastFrequentEntry, currentEntry) => {
            if (currentEntry[1] < leastFrequentEntry[1]) {
                return currentEntry;
            }

            return leastFrequentEntry;
        },
        ['', Infinity],
    );

    return leastFrequentLetter;
}

export function partTwo(): string {
    const columnHistograms = buildColumnHistograms(MESSAGES);
    const mostFrequentLetters = columnHistograms.map(findLeastFrequentLetter);

    return mostFrequentLetters.join('');
}

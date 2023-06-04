// --- Day 5: Doesn't He Have Intern-Elves For This? ---
// https://adventofcode.com/2015/day/5

import { InputReader } from '#src/InputReader.ts';

const inputReader = new InputReader(import.meta.url);
const strings = inputReader.readAsLines();

function conditionalCount(items: string[], predicate: (item: string) => boolean): number {
    return items.filter(predicate).length;
}

export function partOne(): number {
    return conditionalCount(strings, (string) => {
        const vowelCount = string.match(/[aeiou]/g)?.length ?? 0;
        const containsDoubleLetter = /(?<letter>[a-z])\k<letter>/.test(string);
        const containsForbiddenStrings = /ab|cd|pq|xy/.test(string);

        return vowelCount >= 3 && containsDoubleLetter && !containsForbiddenStrings;
    });
}

export function partTwo(): number {
    return conditionalCount(strings, (string) => {
        const containsRepeatedPair = /(?<letterPair>[a-z]{2}).*\k<letterPair>/.test(string);
        const containsRepeatedLetter = /(?<letter>[a-z]).\k<letter>/.test(string);

        return containsRepeatedPair && containsRepeatedLetter;
    });
}

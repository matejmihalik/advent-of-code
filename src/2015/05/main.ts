// --- Day 5: Doesn't He Have Intern-Elves For This? ---
// https://adventofcode.com/2015/day/5

import { InputReader } from '#src/InputReader.ts';

const STRINGS = new InputReader(import.meta.url).readAsLines();

function conditionalCount(items: string[], predicate: (item: string) => boolean): number {
    return items.filter(predicate).length;
}

export function partOne(): number {
    return conditionalCount(STRINGS, (string) => {
        const hasThreeVowels = /(?:.*?[aeiou].*?){3}/.test(string);
        const containsDoubleLetter = /(?<letter>[a-z])\k<letter>/.test(string);
        const containsForbiddenStrings = /ab|cd|pq|xy/.test(string);

        return hasThreeVowels && containsDoubleLetter && !containsForbiddenStrings;
    });
}

export function partTwo(): number {
    return conditionalCount(STRINGS, (string) => {
        const containsRepeatedPair = /(?<letterPair>[a-z]{2}).*\k<letterPair>/.test(string);
        const containsRepeatedLetter = /(?<letter>[a-z]).\k<letter>/.test(string);

        return containsRepeatedPair && containsRepeatedLetter;
    });
}

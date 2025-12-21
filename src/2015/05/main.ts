// --- Day 5: Doesn't He Have Intern-Elves For This? ---
// https://adventofcode.com/2015/day/5
// https://www.reddit.com/r/adventofcode/comments/3viazx/day_5_solutions

import { InputReader } from '#src/input';
import { conditionalCount } from '#src/utils';

const STRINGS = new InputReader(import.meta.dirname).readAsLines();

export function partOne(): number {
    return conditionalCount(STRINGS, (string) => {
        const hasThreeVowels = (string.match(/[aeiou]/g) ?? []).length >= 3;
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

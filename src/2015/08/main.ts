// --- Day 8: Matchsticks ---
// https://adventofcode.com/2015/day/8
// https://www.reddit.com/r/adventofcode/comments/3vw32y/day_8_solutions

import { InputReader } from '#src/input';

const HEX_NUMERIC_PREFIX = '0x';

const STRINGS = new InputReader(import.meta.dirname).readAsLines();

function sumCharacters(strings: string[]): number {
    return strings.reduce((characterCount, string) => characterCount + string.length, 0);
}

function unescapeString(string: string): string {
    return string
        .slice(1, -1)
        .replaceAll(/\\(?<escapedChar>[\\"])|\\x(?<hexCode>\w{2})/g, (_, escapedChar, hexCode) => {
            if (escapedChar) {
                return escapedChar;
            }

            if (hexCode) {
                return String.fromCharCode(Number(HEX_NUMERIC_PREFIX + hexCode));
            }

            return '';
        });
}

export function partOne(): number {
    const rawCharacterCount = sumCharacters(STRINGS);
    const unescapedStrings = STRINGS.map(unescapeString);
    const unescapedCharacterCount = sumCharacters(unescapedStrings);

    return rawCharacterCount - unescapedCharacterCount;
}

function escapeString(string: string): string {
    return JSON.stringify(string);
}

export function partTwo(): number {
    const rawCharacterCount = sumCharacters(STRINGS);
    const escapedCharacters = STRINGS.map(escapeString);
    const escapedCharacterCount = sumCharacters(escapedCharacters);

    return escapedCharacterCount - rawCharacterCount;
}

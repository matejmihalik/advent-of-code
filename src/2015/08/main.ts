// --- Day 8: Matchsticks ---
// https://adventofcode.com/2015/day/8

import { InputReader } from '#src/InputReader.ts';

const STRINGS = new InputReader(import.meta.url).readAsLines();

function countCharacters(strings: string[], transform = (string: string) => string): number {
    return strings.reduce((characterCount, string) => characterCount + transform(string).length, 0);
}

function unescape(string: string): string {
    return string
        .slice(1, -1)
        .replaceAll(/\\(?<escapedChar>[\\"])|\\x(?<hexaCode>\w{2})/g, (_, escapedChar, hexCode) => {
            if (escapedChar) {
                return escapedChar;
            }

            if (hexCode) {
                return String.fromCharCode(Number(`0x${hexCode}`));
            }

            return '';
        });
}

export function partOne(): number {
    const rawCharacterCount = countCharacters(STRINGS);
    const unescapedCharacterCount = countCharacters(STRINGS, unescape);

    return rawCharacterCount - unescapedCharacterCount;
}

export function partTwo(): number {
    const rawCharacterCount = countCharacters(STRINGS);
    const escapedCharacterCount = countCharacters(STRINGS, JSON.stringify);

    return escapedCharacterCount - rawCharacterCount;
}

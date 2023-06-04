// --- Day 8: Matchsticks ---
// https://adventofcode.com/2015/day/8

import { InputReader } from '#src/InputReader.ts';

const inputReader = new InputReader(import.meta.url);
const strings = inputReader.readAsLines();

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
    const rawCharacterCount = strings.reduce(
        (characterCount, string) => characterCount + string.length,
        0,
    );

    const unescapedCharacterCount = strings.reduce(
        (characterCount, string) => characterCount + unescape(string).length,
        0,
    );

    return rawCharacterCount - unescapedCharacterCount;
}

export function partTwo(): number {
    const escapedCharacterCount = strings.reduce(
        (characterCount, string) => characterCount + JSON.stringify(string).length,
        0,
    );

    const rawCharacterCount = strings.reduce(
        (characterCount, string) => characterCount + string.length,
        0,
    );

    return escapedCharacterCount - rawCharacterCount;
}

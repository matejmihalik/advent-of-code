// --- Day 11: Corporate Policy ---
// https://adventofcode.com/2015/day/11

import { InputReader } from '#src/InputReader.ts';

const EXPIRED_PASSWORD = new InputReader(import.meta.url).readAsString();

const MIN_LETTER_VALUE = 'a'.charCodeAt(0);
const MAX_LETTER_VALUE = 'z'.charCodeAt(0);

function incrementLetter(letter: string): string {
    return String.fromCharCode(
        ((letter.charCodeAt(0) + 1 - MIN_LETTER_VALUE) %
            (MAX_LETTER_VALUE - MIN_LETTER_VALUE + 1)) +
            MIN_LETTER_VALUE,
    );
}

function incrementPassword(currentPassword: string): string {
    let incrementIndex = currentPassword.length - 1;
    const passwordLetterArray = [...currentPassword];

    while (incrementIndex >= 0) {
        const incrementedLetter = incrementLetter(passwordLetterArray[incrementIndex]);
        passwordLetterArray.splice(incrementIndex, 1, incrementedLetter);

        if (incrementedLetter.charCodeAt(0) === MIN_LETTER_VALUE) {
            incrementIndex--;
        } else {
            break;
        }
    }

    return passwordLetterArray.join('');
}

function startsWithConsecutiveLetters(string: string, depth: number): boolean {
    if (string.length < depth) {
        return false;
    }

    if (depth <= 1) {
        return true;
    }

    const isImmediatelyConsecutive = string.charCodeAt(1) - string.charCodeAt(0) === 1;
    return isImmediatelyConsecutive && startsWithConsecutiveLetters(string.slice(1), depth - 1);
}

function hasConsecutiveLetters(string: string, straightLength: number): boolean {
    return Array.from(string).some((_, letterIndex) =>
        startsWithConsecutiveLetters(string.slice(letterIndex), straightLength),
    );
}

function isPasswordValid(password: string): boolean {
    const containsStraight = hasConsecutiveLetters(password, 3);
    const containsForbiddenLetters = /[iol]/.test(password);
    const containsTwoLetterPairs = /(?:(?<letter>[a-z])\k<letter>.*?){2}/.test(password);

    return containsStraight && !containsForbiddenLetters && containsTwoLetterPairs;
}

function findNextValidPasswordIteration(startingPassword: string): string {
    let currentPassword = startingPassword;

    do {
        currentPassword = incrementPassword(currentPassword);
    } while (!isPasswordValid(currentPassword));

    return currentPassword;
}

export function partOne(): string {
    return findNextValidPasswordIteration(EXPIRED_PASSWORD);
}

export function partTwo(): string {
    const startingPassword = partOne();
    return findNextValidPasswordIteration(startingPassword);
}

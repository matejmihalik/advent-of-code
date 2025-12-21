// --- Day 11: Corporate Policy ---
// https://adventofcode.com/2015/day/11
// https://www.reddit.com/r/adventofcode/comments/3wbzyv/day_11_solutions

import { InputReader } from '#src/input';

const FIRST_LETTER = 'a';
const LAST_LETTER = 'z';
const MIN_LETTER_VALUE = FIRST_LETTER.charCodeAt(0);
const MAX_LETTER_VALUE = LAST_LETTER.charCodeAt(0);

const INITIAL_PASSWORD = new InputReader(import.meta.dirname).readAsString();

function incrementLetter(letter: string): string {
    return String.fromCharCode(
        ((letter.charCodeAt(0) - MIN_LETTER_VALUE + 1) % (MAX_LETTER_VALUE - MIN_LETTER_VALUE + 1))
        + MIN_LETTER_VALUE,
    );
}

function incrementPassword(currentPassword: string): string {
    const passwordLetterArray = Array.from(currentPassword);
    let incrementIndex = currentPassword.length;

    do {
        incrementIndex--;
        const incrementedLetter = incrementLetter(passwordLetterArray[incrementIndex]);
        passwordLetterArray.splice(incrementIndex, 1, incrementedLetter);
    } while (passwordLetterArray[incrementIndex] === FIRST_LETTER && incrementIndex > 0);

    return passwordLetterArray.join('');
}

function isPasswordValid(password: string): boolean {
    const containsStraight
        = /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/.test(
            password,
        );
    const containsForbiddenLetters = /[iol]/.test(password);
    const containsTwoLetterPairs = (password.match(/(?<letter>[a-z])\k<letter>/g) ?? []).length >= 2;

    return containsStraight && !containsForbiddenLetters && containsTwoLetterPairs;
}

function findNextValidPassword(initialPassword: string): string {
    let currentPassword = initialPassword;

    do {
        currentPassword = incrementPassword(currentPassword);
    } while (!isPasswordValid(currentPassword));

    return currentPassword;
}

export function partOne(): string {
    return findNextValidPassword(INITIAL_PASSWORD);
}

export function partTwo(): string {
    const initialPassword = partOne();
    return findNextValidPassword(initialPassword);
}

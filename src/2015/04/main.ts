// --- Day 4: The Ideal Stocking Stuffer ---
// https://adventofcode.com/2015/day/4
// https://www.reddit.com/r/adventofcode/comments/3vdn8a/day_4_solutions

import { createHash } from 'crypto';

import { InputReader } from '#src/input';

const HASHING_ALGORITHM = 'md5';
const HASH_DIGEST_ENCODING = 'hex';

const SECRET_KEY = new InputReader(import.meta.dirname).readAsString();

function constructHash(input: string): string {
    return createHash(HASHING_ALGORITHM).update(input).digest(HASH_DIGEST_ENCODING);
}

function findDecimalComponentForHashWithPrefix(targetHashPrefix: string): number {
    let decimalComponent = 0;
    let hash;

    do {
        decimalComponent++;
        hash = constructHash(SECRET_KEY + decimalComponent);
    } while (!hash.startsWith(targetHashPrefix));

    return decimalComponent;
}

export function partOne(): number {
    const targetPrefix = '00000';
    return findDecimalComponentForHashWithPrefix(targetPrefix);
}

export function partTwo(): number {
    const targetPrefix = '000000';
    return findDecimalComponentForHashWithPrefix(targetPrefix);
}

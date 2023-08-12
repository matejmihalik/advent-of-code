// --- Day 4: The Ideal Stocking Stuffer ---
// https://adventofcode.com/2015/day/4

import { createHash } from 'crypto';
import { InputReader } from '#src/InputReader.ts';

const SECRET_KEY = new InputReader(import.meta.url).readAsString();

function constructHash(decimalComponent: number): string {
    return createHash('md5')
        .update(SECRET_KEY + decimalComponent)
        .digest('hex');
}

function findDecimalComponentForHashWithPrefix(hashPrefix: string): number {
    let decimalComponent = 0;
    let hash;

    do {
        decimalComponent++;
        hash = constructHash(decimalComponent);
    } while (!hash.startsWith(hashPrefix));

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

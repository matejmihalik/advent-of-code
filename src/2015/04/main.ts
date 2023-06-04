// --- Day 4: The Ideal Stocking Stuffer ---
// https://adventofcode.com/2015/day/4

import { createHash } from 'crypto';
import { InputReader } from '#src/InputReader.ts';

const inputReader = new InputReader(import.meta.url);
const secretKey = inputReader.readAsString();

function constructHash(decimalComponent: number): string {
    return createHash('md5')
        .update(secretKey + decimalComponent)
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
    return findDecimalComponentForHashWithPrefix('00000');
}

export function partTwo(): number {
    return findDecimalComponentForHashWithPrefix('000000');
}

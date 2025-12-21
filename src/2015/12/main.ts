// --- Day 12: JSAbacusFramework.io ---
// https://adventofcode.com/2015/day/12
// https://www.reddit.com/r/adventofcode/comments/3wh73d/day_12_solutions

import { InputReader } from '#src/input';

type LedgerEntry = Record<string, unknown> | LedgerEntry[] | string | number;

const LEDGER = new InputReader(import.meta.dirname).readAsJson();

function isObject(ledgerEntry: LedgerEntry): ledgerEntry is Record<string, LedgerEntry> {
    return ledgerEntry.constructor === Object;
}

function isArray(ledgerEntry: LedgerEntry): ledgerEntry is LedgerEntry[] {
    return Array.isArray(ledgerEntry);
}

function isNumber(ledgerEntry: LedgerEntry): ledgerEntry is number {
    return Number.isInteger(ledgerEntry);
}

function sumArrayNumbers(array: LedgerEntry[], ignoreKeyword?: string): number {
    return array.reduce<number>((sum, ledgerEntry) =>
        sum + sumLedgerNumbers(ledgerEntry, ignoreKeyword),
    0);
}

function sumLedgerNumbers(ledgerEntry: LedgerEntry, ignoreKeyword?: string): number {
    if (isObject(ledgerEntry)) {
        const entryValues = Object.values(ledgerEntry);

        if (ignoreKeyword && entryValues.includes(ignoreKeyword)) {
            return 0;
        }

        return sumArrayNumbers(entryValues, ignoreKeyword);
    }

    if (isArray(ledgerEntry)) {
        return sumArrayNumbers(ledgerEntry, ignoreKeyword);
    }

    if (isNumber(ledgerEntry)) {
        return ledgerEntry;
    }

    return 0;
}

export function partOne(): number {
    return sumLedgerNumbers(LEDGER);
}

export function partTwo(): number {
    const ignoreKeyword = 'red';
    return sumLedgerNumbers(LEDGER, ignoreKeyword);
}

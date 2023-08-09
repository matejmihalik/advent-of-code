// --- Day 12: JSAbacusFramework.io ---
// https://adventofcode.com/2015/day/12

import { InputReader } from '#src/InputReader.ts';

const inputReader = new InputReader(import.meta.url);
const ledger = inputReader.readAsJson();

type LedgerEntry = Record<string, unknown> | unknown[] | string | number;

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
    return array.reduce(
        (currentSum: number, innerLedgerEntry) =>
            currentSum + sumLedgerNumbers(innerLedgerEntry, ignoreKeyword),
        0,
    );
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
    return sumLedgerNumbers(ledger);
}

export function partTwo(): number {
    return sumLedgerNumbers(ledger, 'red');
}

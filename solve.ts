import { readdirSync } from 'fs';
import { join } from 'path';
import select from '@inquirer/select';

import { descendingSort } from '#src/utils';

let [, , year, day, part] = process.argv;

const SOURCE_DIRECTORY = 'src';
const SOURCE_MODULE = '#src';
const SOLUTION_FILE_NAME = 'main.ts';
const PADDED_DAY_LENGTH = 2;
const FORMATTING_LOCALE = 'en-GB';
const STRING_ZERO = '0';

function getNumericSubdirectories(parentDirectoryPath: string): number[] {
    return readdirSync(parentDirectoryPath, { withFileTypes: true })
        .reduce<number[]>((directories, directoryEntry) => {
            if (!directoryEntry.isDirectory()) {
                return directories;
            }

            const numericDirectory = Number(directoryEntry.name);

            if (!numericDirectory) {
                return directories;
            }

            return [...directories, numericDirectory];
        }, [])
        .sort(descendingSort);
}

function shouldRunPart(targetPart: number): boolean {
    const numericPart = Number(part);
    return !numericPart || numericPart === targetPart;
}

function getCurrentTimestamp(): number {
    return performance.now();
}

function formatTimestamp(timestamp: number): string {
    return timestamp.toLocaleString(FORMATTING_LOCALE, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
    });
}

function attemptSolution(targetPart: number, solution?: () => number | string): void {
    if (!solution || !shouldRunPart(targetPart)) {
        return;
    }

    const startTimestamp = getCurrentTimestamp();
    const result = solution();
    const endTimestamp = getCurrentTimestamp();

    console.log(`Part ${targetPart}: ${result}`);
    console.log(`Time in ms: ${formatTimestamp(endTimestamp - startTimestamp)}`);
}

year ??= await select({
    message: 'Select year',
    choices: getNumericSubdirectories(SOURCE_DIRECTORY).map(String),
});

day ??= await select({
    message: 'Select day',
    choices: getNumericSubdirectories(join(SOURCE_DIRECTORY, year)).map(String),
});

part ??= STRING_ZERO;

const { partOne, partTwo } = await import(
    join(SOURCE_MODULE, year, day.padStart(PADDED_DAY_LENGTH, STRING_ZERO), SOLUTION_FILE_NAME),
);

attemptSolution(1, partOne);
attemptSolution(2, partTwo);

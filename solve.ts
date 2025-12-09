import { readdirSync } from 'fs';
import { join } from 'path';
import select from '@inquirer/select';

let [, , year, day, part] = process.argv;

const LOCALE = 'en-GB';

function descendingSort(a: number, b: number): number {
    return b - a;
}

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
    return timestamp.toLocaleString(LOCALE, {
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
    choices: getNumericSubdirectories('src').map(String),
});

day ??= await select({
    message: 'Select day',
    choices: getNumericSubdirectories(join('src', year)).map(String),
});

part ??= '0';

const { partOne, partTwo } = await import(join('#src', year, day.padStart(2, '0'), 'main.ts'));

attemptSolution(1, partOne);
attemptSolution(2, partTwo);

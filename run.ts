import { readdirSync } from 'fs';
import { join } from 'path';
import inquirer from 'inquirer';

let [, , year, day] = process.argv;

function getSubdirectories(parentDirectoryPath: string): string[] {
    return readdirSync(parentDirectoryPath, { withFileTypes: true })
        .reduce<string[]>((directories, directoryEntry) => {
            if (directoryEntry.isDirectory()) {
                return [...directories, directoryEntry.name];
            }
            return directories;
        }, [])
        .reverse();
}

await inquirer
    .prompt(
        [
            {
                type: 'list',
                loop: false,
                name: 'year',
                message: 'Select year',
                choices: getSubdirectories('src'),
            },
        ],
        { year },
    )
    .then(({ year: chosenYear }) => {
        year = chosenYear;
    });

await inquirer
    .prompt(
        [
            {
                type: 'list',
                loop: false,
                name: 'day',
                message: 'Select day',
                choices: getSubdirectories(join('src', year)),
            },
        ],
        { day },
    )
    .then(({ day: chosenDay }) => {
        day = chosenDay;
    });

const { partOne, partTwo } = await import(join('#src', year, day.padStart(2, '0'), 'main.ts'));

if (partOne) {
    console.log(`Part one: ${partOne()}`);
}

if (partTwo) {
    console.log(`Part two: ${partTwo()}`);
}

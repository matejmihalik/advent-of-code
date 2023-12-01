// --- Day 1: Trebuchet?! ---
// https://adventofcode.com/2023/day/1

import { InputReader } from '#src/InputReader.ts';

const CALIBRATION_LINES = new InputReader(import.meta.url).readAsLines();

type ValueParser = (value: string) => number;

function parseCalibrationLine(
    line: string,
    valueMatcher: RegExp,
    valueParser: ValueParser,
): number {
    const match = line.match(
        new RegExp(
            `(?<firstDigit>${valueMatcher.source})(?:.*(?<lastDigit>${valueMatcher.source}))?`,
        ),
    );

    if (!match) {
        return 0;
    }

    const { groups: { firstDigit, lastDigit } = {} } = match;

    return valueParser(firstDigit) * 10 + valueParser(lastDigit ?? firstDigit);
}

function sumCalibrationValues(
    calibrationLines: string[],
    valueMatcher: RegExp,
    valueParser: ValueParser = (value) => Number(value),
): number {
    return calibrationLines
        .map((line) => parseCalibrationLine(line, valueMatcher, valueParser))
        .reduce((sum, value) => sum + value, 0);
}

export function partOne(): number {
    const valueMatcher = /\d/;

    return sumCalibrationValues(CALIBRATION_LINES, valueMatcher);
}

export function partTwo(): number {
    const wordDigits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const valueMatcher = new RegExp(`\\d|${wordDigits.join('|')}`);

    return sumCalibrationValues(CALIBRATION_LINES, valueMatcher, (value) => {
        const wordDigitIndex = wordDigits.indexOf(value) + 1;
        return wordDigitIndex || Number(value);
    });
}

// --- Day 6: Trash Compactor ---
// https://adventofcode.com/2025/day/6
// https://www.reddit.com/r/adventofcode/comments/1pfguxk/2025_day_6_solutions/

import { InputReader } from '#src/input';

const [
    OPERATION_LINE,
    ...OPERAND_LINES
] = new InputReader(import.meta.dirname).readAsUntrimmedLines().reverse();

const COLUMN_INDEXES = Array.from(OPERATION_LINE.matchAll(/\S/g)).map(
    ({ index }) => index,
);

const OPERATIONS = OPERATION_LINE.trim().split(/\s+/);

const OPERANDS = OPERAND_LINES.map((operandLine) =>
    COLUMN_INDEXES.map((columnIndex, columnIndexIndex) => {
        const nextColumnIndex = COLUMN_INDEXES[columnIndexIndex + 1];
        return operandLine.slice(columnIndex, nextColumnIndex ? nextColumnIndex - 1 : undefined);
    }),
);

function performOperationRows(operation: string, operationIndex: number): number {
    return OPERANDS.reduce((result, operandLine) => {
        const operand = Number(operandLine[operationIndex]);
        return operation === '*' ? result * operand : result + operand;
    },
    Number(operation === '*'),
    );
}

export function partOne(): number {
    return OPERATIONS.reduce((answerSum, operation, operationIndex) =>
        answerSum + performOperationRows(operation, operationIndex),
    0);
}

function performOperationColumns(operation: string, operationIndex: number): number {
    const operandLength = OPERANDS[0][operationIndex].length;
    const operands: number[] = [];

    for (let column = operandLength - 1; column >= 0; column--) {
        const operand = OPERANDS.reduce((operandDigits, operandLine) => {
            operandDigits.push(operandLine[operationIndex][column]);
            return operandDigits;
        }, []);
        operands.push(Number(operand.reverse().join('')));
    }

    return operands.reduce((result, operand) =>
        operation === '*'
            ? result * operand
            : result + operand,
    Number(operation === '*'),
    );
}

export function partTwo(): number {
    return OPERATIONS.reduce((answerSum, operation, operationIndex) =>
        answerSum + performOperationColumns(operation, operationIndex),
    0);
}

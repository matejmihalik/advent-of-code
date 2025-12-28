// --- Day 6: Trash Compactor ---
// https://adventofcode.com/2025/day/6
// https://www.reddit.com/r/adventofcode/comments/1pfguxk/2025_day_6_solutions

import { InputReader } from '#src/input';

enum Operation {
    Addition = '+',
    Multiplication = '*',
}

type ProblemSolver = (operation: Operation, operationIndex: number) => number;

const [
    OPERATION_LINE,
    ...OPERAND_LINES
] = new InputReader(import.meta.dirname).readAsUntrimmedLines().reverse();

const PROBLEM_INDEXES = Array.from(OPERATION_LINE.matchAll(/\S/g)).map(
    ({ index }) => index,
);

const OPERATIONS = OPERATION_LINE.trim().split(/\s+/) as Operation[];

const OPERANDS = OPERAND_LINES.map((operandLine) =>
    PROBLEM_INDEXES.map((problemIndex, problemIndexIndex) => {
        const nextProblemIndex = PROBLEM_INDEXES[problemIndexIndex + 1];
        return operandLine.slice(problemIndex, nextProblemIndex ? nextProblemIndex - 1 : undefined);
    }),
);

function performOperation(operandA: number, operandB: number, operation: Operation): number {
    if (operation === Operation.Addition) {
        return operandA + operandB;
    }

    if (operation === Operation.Multiplication) {
        return operandA * operandB;
    }

    return NaN;
}

function getBaseOperand(operation: Operation): number {
    if (operation === Operation.Addition) {
        return 0;
    }

    if (operation === Operation.Multiplication) {
        return 1;
    }

    return NaN;
}

const performOperationOnRows: ProblemSolver = (operation, operationIndex) =>
    OPERANDS.reduce((result, operandLine) => {
        const operand = Number(operandLine[operationIndex]);
        return performOperation(result, operand, operation);
    },
    getBaseOperand(operation));

function sumProblems(problemSolver: ProblemSolver): number {
    return OPERATIONS.reduce((resultSum, operation, operationIndex) =>
        resultSum + problemSolver(operation, operationIndex),
    0);
}

export function partOne(): number {
    return sumProblems(performOperationOnRows);
}

function getOperandsByColumn(operandLength: number, operationIndex: number): number[] {
    const operands: number[] = [];

    for (let column = operandLength - 1; column >= 0; column--) {
        const operand = OPERANDS.reduce((operandDigits, operandLine) => {
            operandDigits.push(operandLine[operationIndex][column]);
            return operandDigits;
        }, []).reverse().join('');
        operands.push(Number(operand));
    }

    return operands;
}

const performOperationOnColumns: ProblemSolver = (operation, operationIndex) => {
    const operandLength = OPERANDS[0][operationIndex].length;
    const operands = getOperandsByColumn(operandLength, operationIndex);

    return operands.reduce((result, operand) =>
        performOperation(result, operand, operation),
    getBaseOperand(operation));
};

export function partTwo(): number {
    return sumProblems(performOperationOnColumns);
}

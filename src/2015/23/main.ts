// --- Day 23: Opening the Turing Lock ---
// https://adventofcode.com/2015/day/23

import { InputReader } from '#src/InputReader.ts';

import {
    Half,
    Increment,
    Jump,
    JumpIfEven,
    JumpIfOne,
    Triple,
    type Instruction,
} from './instructions/index.ts';
import { Computer, type RegisterMap } from './Computer.ts';
import { Register } from './Register.ts';

const RAW_INSTRUCTIONS = new InputReader(import.meta.url).readAsLines();

const OUTPUT_REGISTER = 'b';

const INSTRUCTIONS = RAW_INSTRUCTIONS.reduce<Instruction[]>((instructions, rawInstruction) => {
    const rawInstructionMatch = rawInstruction.match(
        /^(?<instructionType>\w+) (?:(?<register>\w),? ?)?(?<offset>[+-]\d+)?$/,
    );

    if (!rawInstructionMatch?.groups) {
        return instructions;
    }

    const { instructionType, register, offset } = rawInstructionMatch.groups;

    let currentInstruction;

    switch (instructionType) {
        case 'hlf':
            currentInstruction = new Half(register);
            break;
        case 'inc':
            currentInstruction = new Increment(register);
            break;
        case 'jmp':
            currentInstruction = new Jump(Number(offset));
            break;
        case 'jie':
            currentInstruction = new JumpIfEven(register, Number(offset));
            break;
        case 'jio':
            currentInstruction = new JumpIfOne(register, Number(offset));
            break;
        case 'tpl':
            currentInstruction = new Triple(register);
            break;
        default:
            break;
    }

    if (currentInstruction) {
        instructions.push(currentInstruction);
    }

    return instructions;
}, []);

export function partOne(): number {
    const registerMap: RegisterMap = {
        a: new Register(),
        b: new Register(),
    };

    const computer = new Computer(registerMap);
    computer.executeProgram(INSTRUCTIONS);

    return registerMap[OUTPUT_REGISTER].value;
}

export function partTwo(): number {
    const registerMap: RegisterMap = {
        a: new Register(1),
        b: new Register(),
    };

    const computer = new Computer(registerMap);
    computer.executeProgram(INSTRUCTIONS);

    return registerMap[OUTPUT_REGISTER].value;
}

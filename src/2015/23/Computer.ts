import { type Instruction } from './instructions/index.ts';
import { Register } from './Register.ts';

export type RegisterMap = Record<string, Register>;

export class Computer {
    #registerMap: RegisterMap;

    constructor(registerMap: RegisterMap) {
        this.#registerMap = registerMap;
    }

    executeProgram(instructions: Instruction[]): void {
        let instructionPointer = 0;

        while (instructionPointer < instructions.length) {
            const currentInstruction = instructions[instructionPointer];
            const nextInstructionOffset = currentInstruction.execute(this.#registerMap) ?? 1;
            instructionPointer += nextInstructionOffset;
        }
    }
}

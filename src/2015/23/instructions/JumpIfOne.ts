import { type RegisterMap } from '../Computer.ts';
import { Instruction } from './Instruction.ts';

export class JumpIfOne extends Instruction {
    #registerName: string;
    #jumpOffset: number;

    constructor(registerName: string, jumpOffset: number) {
        super();
        this.#registerName = registerName;
        this.#jumpOffset = jumpOffset;
    }

    execute(registerMap: RegisterMap): number | undefined {
        const register = registerMap[this.#registerName];

        if (register.value === 1) {
            return this.#jumpOffset;
        }

        return undefined;
    }
}

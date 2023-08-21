import { Instruction } from './Instruction.ts';

export class Jump extends Instruction {
    #jumpOffset: number;

    constructor(jumpOffset: number) {
        super();
        this.#jumpOffset = jumpOffset;
    }

    execute(): number {
        return this.#jumpOffset;
    }
}

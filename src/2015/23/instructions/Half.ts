import { type RegisterMap } from '../Computer.ts';
import { Instruction } from './Instruction.ts';

export class Half extends Instruction {
    #registerName: string;

    constructor(registerName: string) {
        super();
        this.#registerName = registerName;
    }

    execute(registerMap: RegisterMap): void {
        const register = registerMap[this.#registerName];
        register.value /= 2;
    }
}

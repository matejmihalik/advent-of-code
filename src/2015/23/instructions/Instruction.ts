import { type RegisterMap } from '../Computer.ts';

export abstract class Instruction {
    abstract execute(registerMap: RegisterMap): number | void;
}

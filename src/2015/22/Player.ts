import { Character } from './Character.ts';
import { type Spell } from './Spellbook.ts';

const STARTING_PLAYER_HP = 50;
const STARTING_PLAYER_MP = 500;

export type SpellSequence = Spell[];

export class Player extends Character {
    #mp = STARTING_PLAYER_MP;
    #armor = 0;
    #spellSequence: SpellSequence;

    constructor(spellSequence: SpellSequence = []) {
        super({ hp: STARTING_PLAYER_HP });
        this.#spellSequence = [...spellSequence];
    }

    get armor(): number {
        return this.#armor;
    }

    set armor(value: number) {
        this.#armor = value;
    }

    refresh(amount: number): void {
        this.#mp += amount;
    }

    attack(target: Character): ReturnType<Spell['cast']> {
        const chosenSpell = this.#spellSequence.shift();

        if (!chosenSpell) {
            this.die();
            return undefined;
        }

        this.#mp -= chosenSpell.manaCost;

        if (this.#mp < 0) {
            this.die();
            return undefined;
        }

        return chosenSpell.cast(target, this);
    }

    takeDamage(damage: number): void {
        super.takeDamage(damage, this.#armor);
    }
}

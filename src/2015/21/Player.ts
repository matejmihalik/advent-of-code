import { Character } from './Character.ts';
import { type Equipment } from './Store.ts';

export interface EquipmentSet {
    weapon: Equipment;
    armor?: Equipment;
    leftHandRing?: Equipment;
    rightHandRing?: Equipment;
}

const STARTING_PLAYER_HP = 100;

export class Player extends Character {
    #weapon: Equipment;
    #armor?: Equipment;
    #leftHandRing?: Equipment;
    #rightHandRing?: Equipment;

    constructor({ weapon, armor, leftHandRing, rightHandRing }: EquipmentSet) {
        super({ hp: STARTING_PLAYER_HP });
        this.#weapon = weapon;
        this.#armor = armor;
        this.#leftHandRing = leftHandRing;
        this.#rightHandRing = rightHandRing;
    }

    attack(target: Character): void {
        const damageBonus = this.getTotalEquipmentModifier('damage');
        super.attack(target, damageBonus);
    }

    takeDamage(damage: number): void {
        const armorBonus = this.getTotalEquipmentModifier('armor');
        super.takeDamage(damage, armorBonus);
    }

    getTotalEquipmentModifier(targetStat: keyof Equipment): number {
        return [this.#weapon, this.#armor, this.#leftHandRing, this.#rightHandRing].reduce(
            (totalValue, equipment) => totalValue + (equipment?.[targetStat] ?? 0),
            0,
        );
    }
}

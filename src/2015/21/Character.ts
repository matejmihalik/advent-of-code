export interface CharacterStats {
    hp?: number;
    damage?: number;
    armor?: number;
}

export class Character {
    #hp: number;
    #damage: number;
    #armor: number;

    constructor({ hp = 1, damage = 0, armor = 0 }: CharacterStats = {}) {
        this.#hp = hp;
        this.#damage = damage;
        this.#armor = armor;
    }

    get remainingHp(): number {
        return this.#hp;
    }

    isDead(): boolean {
        return this.#hp <= 0;
    }

    attack(target: Character, damageModifier = 0): void {
        if (this.isDead()) {
            return;
        }

        const totalDamage = this.#damage + damageModifier;
        target.takeDamage(totalDamage);
    }

    takeDamage(damage: number, armorModifier = 0): void {
        const totalArmor = this.#armor + armorModifier;
        const damageTaken = Math.max(damage - totalArmor, 1);
        this.#hp -= damageTaken;
    }
}

export interface CharacterStats {
    hp?: number;
    damage?: number;
}

export class Character {
    #hp: number;
    #damage: number;

    constructor({ hp = 1, damage = 0 }: CharacterStats = {}) {
        this.#hp = hp;
        this.#damage = damage;
    }

    get remainingHp(): number {
        return this.#hp;
    }

    isDead(): boolean {
        return this.#hp <= 0;
    }

    heal(amount: number): void {
        this.#hp += amount;
    }

    die(): void {
        this.#hp = 0;
    }

    attack(target: Character, damageModifier = 0): void {
        const totalDamage = this.#damage + damageModifier;
        target.takeDamage(totalDamage);
    }

    takeDamage(damage: number, armorModifier = 0): void {
        const damageTaken = Math.max(damage - armorModifier, 1);
        this.#hp -= damageTaken;
    }
}

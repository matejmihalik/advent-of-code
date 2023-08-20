import { type Character } from './Character.ts';
import { type Player } from './Player.ts';

export interface SpellEffect {
    duration: number;
    onApply?: () => void;
    onTick?: () => void;
    onExpire?: () => void;
}

export interface Spell {
    manaCost: number;
    cast: (target: Character, caster: Player) => SpellEffect | void;
}

const MAGIC_MISSILE: Spell = {
    manaCost: 53,
    cast: (target) => target.takeDamage(4),
};

const DRAIN: Spell = {
    manaCost: 73,
    cast: (target, caster) => {
        target.takeDamage(2);
        caster.heal(2);
    },
};

const SHIELD: Spell = {
    manaCost: 113,
    cast: (_, caster) => ({
        duration: 6,
        onApply: () => {
            caster.armor += 7;
        },
        onExpire: () => {
            caster.armor -= 7;
        },
    }),
};

const POISON: Spell = {
    manaCost: 173,
    cast: (target) => ({
        duration: 6,
        onTick: () => target.takeDamage(3),
    }),
};

const RECHARGE: Spell = {
    manaCost: 229,
    cast: (_, caster) => ({
        duration: 5,
        onTick: () => caster.refresh(101),
    }),
};

export const Spellbook = [MAGIC_MISSILE, DRAIN, SHIELD, POISON, RECHARGE];

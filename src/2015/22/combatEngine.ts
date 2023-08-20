import { type Character } from './Character.ts';
import { type Player } from './Player.ts';
import { type SpellEffect } from './Spellbook.ts';

export type Difficulty = 'normal' | 'hard';

const DIFFICULTY_DAMAGE_MODIFIER_MAP: Record<Difficulty, number> = {
    normal: 0,
    hard: 1,
};

function processEffects(effects: SpellEffect[]): SpellEffect[] {
    return effects.reduce<SpellEffect[]>((ongoingEffects, currentEffect) => {
        currentEffect.onTick?.();
        currentEffect.duration--;

        if (currentEffect.duration) {
            return [...ongoingEffects, currentEffect];
        }

        currentEffect.onExpire?.();
        return ongoingEffects;
    }, []);
}

export function resolveCombat(player: Player, boss: Character, difficulty: Difficulty): number {
    const difficultyDamageModifier = DIFFICULTY_DAMAGE_MODIFIER_MAP[difficulty];

    let spellsCast = 0;
    let activeEffects: SpellEffect[] = [];

    while (!player.isDead() && !boss.isDead()) {
        activeEffects = processEffects(activeEffects);

        if (boss.isDead()) {
            break;
        }

        spellsCast++;
        const spellEffect = player.attack(boss);

        if (spellEffect) {
            spellEffect.onApply?.();
            activeEffects.push(spellEffect);
        }

        if (player.isDead() || boss.isDead()) {
            break;
        }

        activeEffects = processEffects(activeEffects);

        if (boss.isDead()) {
            break;
        }

        boss.attack(player, difficultyDamageModifier);
    }

    return spellsCast;
}

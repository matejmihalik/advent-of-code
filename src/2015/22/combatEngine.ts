import { type Character } from './Character.ts';
import { type Player } from './Player.ts';
import { type SpellEffect } from './Spellbook.ts';

export type Difficulty = 'normal' | 'hard';

function createDifficultyModifierEffect(player: Player, difficulty: Difficulty): SpellEffect {
    const difficultyDamageMap: Record<Difficulty, number> = {
        normal: 0,
        hard: 1,
    };

    return {
        duration: Infinity,
        onTick: () => player.takeDirectDamage(difficultyDamageMap[difficulty]),
    };
}

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

function isCombatOver(player: Player, boss: Character): boolean {
    return player.isDead() || boss.isDead();
}

export function resolveCombat(player: Player, boss: Character, difficulty: Difficulty): number {
    let spellsCast = 0;
    let activeEffects: SpellEffect[] = [];
    const difficultyModifierEffect = createDifficultyModifierEffect(player, difficulty);
    let globalEffects = [difficultyModifierEffect];

    while (!isCombatOver(player, boss)) {
        globalEffects = processEffects(globalEffects);

        if (isCombatOver(player, boss)) {
            break;
        }

        activeEffects = processEffects(activeEffects);

        if (isCombatOver(player, boss)) {
            break;
        }

        spellsCast++;
        const spellEffect = player.attack(boss);

        if (spellEffect) {
            spellEffect.onApply?.();
            activeEffects.push(spellEffect);
        }

        if (isCombatOver(player, boss)) {
            break;
        }

        activeEffects = processEffects(activeEffects);

        if (isCombatOver(player, boss)) {
            break;
        }

        boss.attack(player);
    }

    return spellsCast;
}

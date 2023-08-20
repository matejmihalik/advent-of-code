// --- Day 22: Wizard Simulator 20XX ---
// https://adventofcode.com/2015/day/22

import { InputReader } from '#src/InputReader.ts';

import { Character, type CharacterStats } from './Character.ts';
import { Player, SpellSequence } from './Player.ts';
import { type Difficulty, resolveCombat } from './combatEngine.ts';
import { findMostEfficientSpellSequence, type FitnessComparator } from './evolutionaryAlgorithm.ts';

const RAW_BOSS_STATS = new InputReader(import.meta.url).readAsLines();

const BOSS_STATS = RAW_BOSS_STATS.reduce<CharacterStats>((bossStats, rawStat) => {
    const rawStatMatch = rawStat.match(/^(?<statName>\w+(?: \w+)*): (?<statValue>\d+)$/);

    if (!rawStatMatch?.groups) {
        return bossStats;
    }

    const { statName, statValue } = rawStatMatch.groups;

    const statAttributeMap: Record<string, keyof CharacterStats> = {
        'Hit Points': 'hp',
        Damage: 'damage',
    };

    return {
        [statAttributeMap[statName]]: Number(statValue),
        ...bossStats,
    };
}, {});

function calculateTotalManaConsumed(spellSequence: SpellSequence, spellsCast: number): number {
    const castSpells = spellSequence.slice(0, spellsCast);
    return castSpells.reduce((totalManaCost, { manaCost }) => totalManaCost + manaCost, 0);
}

const createSpellSequenceFitnessComparator =
    (difficulty: Difficulty): FitnessComparator =>
    (spellSequenceA, spellSequenceB) => {
        const playerA = new Player(spellSequenceA);
        const playerB = new Player(spellSequenceB);

        const bossA = new Character(BOSS_STATS);
        const bossB = new Character(BOSS_STATS);

        const spellsCastA = resolveCombat(playerA, bossA, difficulty);
        const spellsCastB = resolveCombat(playerB, bossB, difficulty);

        const playerASurvived = !playerA.isDead();
        const playerBSurvived = !playerB.isDead();
        const survivalDifference = Number(playerBSurvived) - Number(playerASurvived);

        if (survivalDifference) {
            return survivalDifference;
        }

        if (!playerASurvived && !playerBSurvived) {
            return bossA.remainingHp - bossB.remainingHp;
        }

        const manaConsumedByPlayerA = calculateTotalManaConsumed(spellSequenceA, spellsCastA);
        const manaConsumedByPlayerB = calculateTotalManaConsumed(spellSequenceB, spellsCastB);

        return manaConsumedByPlayerA - manaConsumedByPlayerB;
    };

export function partOne(): number {
    const difficulty: Difficulty = 'normal';
    const mostEfficientSpellSequence = findMostEfficientSpellSequence(
        createSpellSequenceFitnessComparator(difficulty),
    );

    const player = new Player(mostEfficientSpellSequence);
    const boss = new Character(BOSS_STATS);
    const spellsCast = resolveCombat(player, boss, difficulty);

    return calculateTotalManaConsumed(mostEfficientSpellSequence, spellsCast);
}

export function partTwo(): number {
    const difficulty: Difficulty = 'hard';
    const mostEfficientSpellSequence = findMostEfficientSpellSequence(
        createSpellSequenceFitnessComparator(difficulty),
    );

    const player = new Player(mostEfficientSpellSequence);
    const boss = new Character(BOSS_STATS);
    const spellsCast = resolveCombat(player, boss, difficulty);

    return calculateTotalManaConsumed(mostEfficientSpellSequence, spellsCast);
}

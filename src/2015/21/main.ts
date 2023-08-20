// --- Day 21: RPG Simulator 20XX ---
// https://adventofcode.com/2015/day/21

import { InputReader } from '#src/InputReader.ts';

import { Character, type CharacterStats } from './Character.ts';
import { Player } from './Player.ts';
import { resolveCombat } from './combatEngine.ts';
import { findBestEquipmentSet, FitnessComparator } from './evolutionaryAlgorithm.ts';

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
        Armor: 'armor',
    };

    return {
        [statAttributeMap[statName]]: Number(statValue),
        ...bossStats,
    };
}, {});

export function partOne(): number {
    const fitnessComparator: FitnessComparator = (equipmentSetA, equipmentSetB) => {
        const playerA = new Player(equipmentSetA);
        const playerB = new Player(equipmentSetB);

        const bossA = new Character(BOSS_STATS);
        const bossB = new Character(BOSS_STATS);

        resolveCombat(playerA, bossA);
        resolveCombat(playerB, bossB);

        const playerASurvived = !playerA.isDead();
        const playerBSurvived = !playerB.isDead();
        const survivalDifference = Number(playerBSurvived) - Number(playerASurvived);

        if (survivalDifference) {
            return survivalDifference;
        }

        if (!playerASurvived && !playerBSurvived) {
            return bossA.remainingHp - bossB.remainingHp;
        }

        const playerAEquipmentCost = playerA.getTotalEquipmentModifier('cost');
        const playerBEquipmentCost = playerB.getTotalEquipmentModifier('cost');

        return playerAEquipmentCost - playerBEquipmentCost;
    };

    const cheapestWinningEquipmentSet = findBestEquipmentSet(fitnessComparator);

    return new Player(cheapestWinningEquipmentSet).getTotalEquipmentModifier('cost');
}

export function partTwo(): number {
    const fitnessComparator: FitnessComparator = (equipmentSetA, equipmentSetB) => {
        const playerA = new Player(equipmentSetA);
        const playerB = new Player(equipmentSetB);

        const bossA = new Character(BOSS_STATS);
        const bossB = new Character(BOSS_STATS);

        resolveCombat(playerA, bossA);
        resolveCombat(playerB, bossB);

        const playerADied = playerA.isDead();
        const playerBDied = playerB.isDead();
        const survivalDifference = Number(playerBDied) - Number(playerADied);

        if (survivalDifference) {
            return survivalDifference;
        }

        if (!playerADied && !playerBDied) {
            return playerA.remainingHp - playerB.remainingHp;
        }

        const playerAEquipmentCost = playerA.getTotalEquipmentModifier('cost');
        const playerBEquipmentCost = playerB.getTotalEquipmentModifier('cost');

        return playerBEquipmentCost - playerAEquipmentCost;
    };

    const mostExpensiveLoosingEquipmentSet = findBestEquipmentSet(fitnessComparator);

    return new Player(mostExpensiveLoosingEquipmentSet).getTotalEquipmentModifier('cost');
}

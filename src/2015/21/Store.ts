export interface Equipment {
    damage: number;
    armor: number;
    cost: number;
}

type EquipmentCategory = 'weapons' | 'armor' | 'rings';

const DAGGER: Equipment = {
    damage: 4,
    armor: 0,
    cost: 8,
};
const SHORTSWORD: Equipment = {
    damage: 5,
    armor: 0,
    cost: 10,
};
const WARHAMMER: Equipment = {
    damage: 6,
    armor: 0,
    cost: 25,
};
const LONGSWORD: Equipment = {
    damage: 7,
    armor: 0,
    cost: 40,
};
const GREATAXE: Equipment = {
    damage: 8,
    armor: 0,
    cost: 74,
};

const LEATHER: Equipment = {
    damage: 0,
    armor: 1,
    cost: 13,
};
const CHAINMAIL: Equipment = {
    damage: 0,
    armor: 2,
    cost: 31,
};
const SPLINTMAIL: Equipment = {
    damage: 0,
    armor: 3,
    cost: 53,
};
const BANDEDMAIL: Equipment = {
    damage: 0,
    armor: 4,
    cost: 75,
};
const PLATEMAIL: Equipment = {
    damage: 0,
    armor: 5,
    cost: 102,
};

const DAMAGE_1: Equipment = {
    damage: 1,
    armor: 0,
    cost: 25,
};
const DAMAGE_2: Equipment = {
    damage: 2,
    armor: 0,
    cost: 50,
};
const DAMAGE_3: Equipment = {
    damage: 3,
    armor: 0,
    cost: 100,
};
const DEFENSE_1: Equipment = {
    damage: 0,
    armor: 1,
    cost: 20,
};
const DEFENSE_2: Equipment = {
    damage: 0,
    armor: 2,
    cost: 40,
};
const DEFENSE_3: Equipment = {
    damage: 0,
    armor: 3,
    cost: 80,
};

export const Store: Record<EquipmentCategory, Equipment[]> = {
    weapons: [DAGGER, SHORTSWORD, WARHAMMER, LONGSWORD, GREATAXE],
    armor: [LEATHER, CHAINMAIL, SPLINTMAIL, BANDEDMAIL, PLATEMAIL],
    rings: [DAMAGE_1, DAMAGE_2, DAMAGE_3, DEFENSE_1, DEFENSE_2, DEFENSE_3],
};

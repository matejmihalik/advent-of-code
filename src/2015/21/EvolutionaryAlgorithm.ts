import { type EquipmentSet } from './Player.ts';
import { type Equipment, Store } from './Store.ts';

const GENERATION_CAP = 1000;
const POPULATION_SIZE = 100;
const DESCENDANTS_POOL_SIZE = 10;
const MUTATION_RATE = 0.2;

type OptionalEquipment = Equipment | undefined;

export type FitnessComparator = (
    equipmentSetA: EquipmentSet,
    equipmentSetB: EquipmentSet,
) => number;

function pickRandomEquipment(
    availableEquipment: Equipment[],
    bannedEquipment: Equipment[],
    canBeEmpty: false,
): Equipment;
function pickRandomEquipment(
    availableEquipment: Equipment[],
    bannedEquipment?: OptionalEquipment[],
    canBeEmpty?: true,
): OptionalEquipment;
function pickRandomEquipment(
    availableEquipment: Equipment[],
    bannedEquipment: OptionalEquipment[] = [],
    canBeEmpty = true,
): OptionalEquipment {
    const equipmentPool: OptionalEquipment[] = availableEquipment.filter(
        (equipment) => !bannedEquipment.includes(equipment),
    );

    if (canBeEmpty) {
        equipmentPool.push(undefined);
    }

    const randomIndex = Math.floor(Math.random() * equipmentPool.length);

    return equipmentPool[randomIndex];
}

function generateRandomEquipmentSet(): EquipmentSet {
    const equipmentSet: EquipmentSet = {
        weapon: pickRandomEquipment(Store.weapons, [], false),
        armor: pickRandomEquipment(Store.armor),
    };

    const leftHandRing = pickRandomEquipment(Store.rings);

    equipmentSet.leftHandRing = leftHandRing;
    equipmentSet.rightHandRing = pickRandomEquipment(Store.rings, [leftHandRing]);

    return equipmentSet;
}

function constructParentPairs(parents: EquipmentSet[]): EquipmentSet[][] {
    return parents.reduce<EquipmentSet[][]>((pairs, currentSet, currentSetIndex) => {
        if (currentSetIndex % 2 === 0) {
            pairs.push([currentSet]);
        } else {
            const pairIndex = Math.floor(currentSetIndex / 2);
            pairs[pairIndex].push(currentSet);
        }
        return pairs;
    }, []);
}

function crossoverEquipmentSets(parents: EquipmentSet[]): EquipmentSet[] {
    const parentPairs = constructParentPairs(parents);

    return parentPairs.reduce<EquipmentSet[]>((children, [parentA, parentB]) => {
        const childA: EquipmentSet = {
            weapon: parentA.weapon,
            armor: parentA.armor,
            leftHandRing: parentB.leftHandRing,
            rightHandRing: parentB.rightHandRing,
        };

        const childB: EquipmentSet = {
            weapon: parentB.weapon,
            armor: parentB.armor,
            leftHandRing: parentA.leftHandRing,
            rightHandRing: parentA.rightHandRing,
        };

        return [...children, childA, childB];
    }, []);
}

function mutateEquipmentSet(equipmentSet: EquipmentSet): EquipmentSet {
    if (Math.random() < MUTATION_RATE) {
        equipmentSet.weapon = pickRandomEquipment(Store.weapons, [equipmentSet.weapon], false);
    }

    if (Math.random() < MUTATION_RATE) {
        equipmentSet.armor = pickRandomEquipment(Store.armor, [equipmentSet.armor]);
    }

    if (Math.random() < MUTATION_RATE) {
        equipmentSet.leftHandRing = pickRandomEquipment(Store.rings, [
            equipmentSet.leftHandRing,
            equipmentSet.rightHandRing,
        ]);
    }

    if (Math.random() < MUTATION_RATE) {
        equipmentSet.rightHandRing = pickRandomEquipment(Store.rings, [
            equipmentSet.rightHandRing,
            equipmentSet.leftHandRing,
        ]);
    }

    return equipmentSet;
}

export function findBestEquipmentSet(fitnessComparator: FitnessComparator): EquipmentSet {
    const population: EquipmentSet[] = Array(POPULATION_SIZE).fill(generateRandomEquipmentSet());

    for (let generationNumber = 0; generationNumber < GENERATION_CAP; generationNumber++) {
        population.sort(fitnessComparator);

        const bestEquipmentSets = population.slice(0, DESCENDANTS_POOL_SIZE);
        const descendantEquipmentSets = crossoverEquipmentSets(bestEquipmentSets);
        descendantEquipmentSets.forEach(mutateEquipmentSet);

        population.splice(
            POPULATION_SIZE - DESCENDANTS_POOL_SIZE,
            DESCENDANTS_POOL_SIZE,
            ...descendantEquipmentSets,
        );
    }

    return population[0];
}

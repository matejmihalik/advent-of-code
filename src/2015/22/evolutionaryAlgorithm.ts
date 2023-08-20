import { Character } from './Character.ts';
import { Player, type SpellSequence } from './Player.ts';
import { type Spell, Spellbook } from './Spellbook.ts';

const GENERATION_CAP = 5000;
const POPULATION_SIZE = 100;
const DESCENDANTS_POOL_SIZE = 20;
const MUTATION_RATE = 0.25;
const SPELL_SEQUENCE_SIZE = 20;

export type FitnessComparator = (
    spellSequenceA: SpellSequence,
    spellSequenceB: SpellSequence,
) => number;

function canInsertSpellIntoSequence(spellSequence: SpellSequence, spell: Spell): boolean {
    const spellEffect = spell.cast(new Character(), new Player());

    if (!spellEffect) {
        return true;
    }

    const spellCooldown = Math.ceil(spellEffect.duration / 2) - 1;

    if (!spellCooldown) {
        return true;
    }

    const cooldownSequence = spellSequence.slice(-spellCooldown);

    return !cooldownSequence.includes(spell);
}

function pickRandomSpell(precedingSequence: SpellSequence, currentSpell?: Spell): Spell {
    const spellPool = Spellbook.filter((spell) => {
        if (spell === currentSpell) {
            return false;
        }

        return canInsertSpellIntoSequence(precedingSequence, spell);
    });

    const randomIndex = Math.floor(Math.random() * spellPool.length);

    return spellPool[randomIndex];
}

function generateSpellSequence(): SpellSequence {
    return Array(SPELL_SEQUENCE_SIZE)
        .fill(null)
        .reduce<SpellSequence>((partialSequence) => {
            partialSequence.push(pickRandomSpell(partialSequence));
            return partialSequence;
        }, []);
}

function mutateSpellSequence(spellSequence: SpellSequence): SpellSequence {
    return spellSequence.reduce<SpellSequence>((partialSequence, currentSpell) => {
        let replacementSpell = currentSpell;

        if (
            !canInsertSpellIntoSequence(partialSequence, currentSpell) ||
            Math.random() < MUTATION_RATE
        ) {
            replacementSpell = pickRandomSpell(partialSequence, currentSpell);
        }

        partialSequence.push(replacementSpell);

        return partialSequence;
    }, []);
}

export function findMostEfficientSpellSequence(
    fitnessComparator: FitnessComparator,
): SpellSequence {
    const population: SpellSequence[] = Array(POPULATION_SIZE)
        .fill(null)
        .map(generateSpellSequence);

    for (let generationNumber = 0; generationNumber < GENERATION_CAP; generationNumber++) {
        population.sort(fitnessComparator);

        const bestSpellSequences = population.slice(0, DESCENDANTS_POOL_SIZE);
        const descendantSpellSequences = bestSpellSequences.map(mutateSpellSequence);

        population.splice(
            POPULATION_SIZE - DESCENDANTS_POOL_SIZE,
            DESCENDANTS_POOL_SIZE,
            ...descendantSpellSequences,
        );
    }

    return population[0];
}

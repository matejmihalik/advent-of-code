// --- Day 19: Medicine for Rudolph ---
// https://adventofcode.com/2015/day/19
// https://www.reddit.com/r/adventofcode/comments/3xflz8/day_19_solutions

import { AStar, type HeuristicFunction, type StateExplorationFunction } from '#src/algorithms';
import { InputReader } from '#src/input';

type Replacement = [originalSequence: string, replacementSequence: string];

const SEQUENCE_SEPARATOR = ' => ';

const [
    REPLACEMENTS_SECTION,
    MEDICINE_MOLECULE_SECTION,
] = new InputReader(import.meta.dirname).readAsSections();

const MEDICINE_MOLECULE = MEDICINE_MOLECULE_SECTION.readAsString();

function parseReplacement(replacement: string): Replacement {
    const [originalSequence, replacementSequence] = replacement.split(SEQUENCE_SEPARATOR);
    return [originalSequence, replacementSequence];
}

const REPLACEMENTS = REPLACEMENTS_SECTION.readAsLines(parseReplacement);

function getAllMoleculeMutationsForSingleReplacement(
    molecule: string,
    replacement: Replacement,
    reverse: boolean,
): string[] {
    let [targetSequence, replacementSequence] = replacement;

    if (reverse) {
        [replacementSequence, targetSequence] = replacement;
    }

    return Array.from(molecule.matchAll(new RegExp(targetSequence, 'g')).map(({ index }) =>
        molecule.slice(0, index)
        + replacementSequence
        + molecule.slice(index + targetSequence.length),
    ));
}

function getAllPossibleMoleculeMutations(molecule: string, reverse = false): Set<string> {
    return REPLACEMENTS.reduce((allMutations, replacement) => {
        getAllMoleculeMutationsForSingleReplacement(
            molecule,
            replacement,
            reverse,
        ).forEach((mutation) => allMutations.add(mutation));
        return allMutations;
    }, new Set<string>());
}

export function partOne(): number {
    return getAllPossibleMoleculeMutations(MEDICINE_MOLECULE).size;
}

export function partTwo(): number {
    const targetMolecule = 'e';
    const heuristicFunction: HeuristicFunction<string> = (molecule) => molecule.length;
    const stateExplorationFunction: StateExplorationFunction<string> = (molecule) =>
        Array.from(getAllPossibleMoleculeMutations(molecule, true));

    const aStar = new AStar(MEDICINE_MOLECULE, heuristicFunction, stateExplorationFunction);

    return aStar.findMinimumDistanceToGoal(targetMolecule);
}

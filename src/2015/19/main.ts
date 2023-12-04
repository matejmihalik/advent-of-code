// --- Day 19: Medicine for Rudolph ---
// https://adventofcode.com/2015/day/19

import { InputReader } from '#src/InputReader.ts';

const [RAW_REPLACEMENTS_SECTION, INPUT_MOLECULE_SECTION] = new InputReader(
    import.meta.url,
).readAsSections();
const RAW_REPLACEMENTS = RAW_REPLACEMENTS_SECTION.readAsLines();
const INPUT_MOLECULE = INPUT_MOLECULE_SECTION.readAsString();

type Replacement = [originalSequence: string, replacementSequence: string];

const REPLACEMENTS = RAW_REPLACEMENTS.reduce<Replacement[]>((replacements, replacement) => {
    const replacementMatch = replacement.match(
        /^(?<targetSequence>\w+) => (?<replacementSequence>\w+)$/,
    );

    if (!replacementMatch?.groups) {
        return replacements;
    }

    const { targetSequence, replacementSequence } = replacementMatch.groups;

    replacements.push([targetSequence, replacementSequence]);

    return replacements;
}, []).sort(
    ([, replacementSequenceA], [, replacementSequenceB]) =>
        replacementSequenceB.length - replacementSequenceA.length,
);

function getMutationsForReplacement(targetSequence: string, replacementSequence: string): string[] {
    const occurrenceIndexes = Array.from(
        INPUT_MOLECULE.matchAll(new RegExp(targetSequence, 'g')),
    ).map(({ index }) => index!);

    return occurrenceIndexes.map(
        (index) =>
            INPUT_MOLECULE.slice(0, index) +
            replacementSequence +
            INPUT_MOLECULE.slice(index + targetSequence.length),
    );
}

function getAllPossibleMutations(): Set<string> {
    return REPLACEMENTS.reduce((allMutations, [targetSequence, replacementSequence]) => {
        const currentMutations = getMutationsForReplacement(targetSequence, replacementSequence);
        currentMutations.forEach((mutation) => allMutations.add(mutation));
        return allMutations;
    }, new Set<string>());
}

export function partOne(): number {
    return getAllPossibleMutations().size;
}

function undoLongestMutation(molecule: string): string {
    const longestAppliedMutation = REPLACEMENTS.find(([, replacementSequence]) =>
        molecule.includes(replacementSequence),
    );

    if (!longestAppliedMutation) {
        return molecule;
    }

    const [originalSequence, replacementSequence] = longestAppliedMutation;

    return molecule.replace(replacementSequence, originalSequence);
}

export function partTwo(): number {
    const targetMolecule = 'e';
    let stepCount = 0;
    let currentMolecule = INPUT_MOLECULE;

    while (currentMolecule !== targetMolecule) {
        currentMolecule = undoLongestMutation(currentMolecule);
        stepCount++;
    }

    return stepCount;
}

// --- Day 17: No Such Thing as Too Much ---
// https://adventofcode.com/2015/day/17

import { InputReader } from '#src/InputReader.ts';

const ALL_CONTAINERS = new InputReader(import.meta.url).readAsNumbers();

const EGGNOG_AMOUNT = 150;

function getAllExactContainerCombinations(
    containers: number[],
    targetCapacity: number,
): number[][] {
    return containers.reduce<number[][]>(
        (existingCombinations, currentContainer, currentContainerIndex) => {
            const otherContainers = containers.slice(currentContainerIndex + 1);

            if (currentContainer === targetCapacity) {
                return [...existingCombinations, [currentContainer]];
            }

            if (currentContainer > targetCapacity) {
                return existingCombinations;
            }

            const discoveredCombinations = getAllExactContainerCombinations(
                otherContainers,
                targetCapacity - currentContainer,
            ).map((combination) => [currentContainer, ...combination]);

            return [...existingCombinations, ...discoveredCombinations];
        },
        [],
    );
}

export function partOne(): number {
    return getAllExactContainerCombinations(ALL_CONTAINERS, EGGNOG_AMOUNT).length;
}

export function partTwo(): number {
    const exactCombinations = getAllExactContainerCombinations(ALL_CONTAINERS, EGGNOG_AMOUNT);
    const exactCombinationLengths = exactCombinations.map((combination) => combination.length);
    const minimalNumberOfContainersRequired = Math.min(...exactCombinationLengths);

    return exactCombinationLengths.reduce(
        (currentCount, combinationLength) =>
            combinationLength === minimalNumberOfContainersRequired
                ? currentCount + 1
                : currentCount,
        0,
    );
}

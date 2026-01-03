// --- Day 17: No Such Thing as Too Much ---
// https://adventofcode.com/2015/day/17
// https://www.reddit.com/r/adventofcode/comments/3x6cyr/day_17_solutions

import { type Combination, Knapsack } from '#src/algorithms';
import { InputReader } from '#src/input';
import { conditionalCount } from '#src/utils';

const EGGNOG_AMOUNT = 150;

const CONTAINERS = new InputReader(import.meta.dirname).readAsNumbers();

export function partOne(): number {
    const knapsack = new Knapsack(EGGNOG_AMOUNT, CONTAINERS);
    return knapsack.findAllCombinations().length;
}

function findMinimumContainerCount(combinations: Combination[]): number {
    return combinations.reduce((minimumContainerCount, currentCombination) => {
        const currentCombinationContainerCount = conditionalCount(currentCombination);
        return Math.min(minimumContainerCount, currentCombinationContainerCount);
    }, Infinity);
}

export function partTwo(): number {
    const knapsack = new Knapsack(EGGNOG_AMOUNT, CONTAINERS);
    const containerCombinations = knapsack.findAllCombinations();
    const minimumContainerCount = findMinimumContainerCount(containerCombinations);

    return conditionalCount(containerCombinations, (combination) => {
        const combinationContainerCount = conditionalCount(combination);
        return combinationContainerCount === minimumContainerCount;
    });
}

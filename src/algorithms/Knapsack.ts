import { memoize } from '#src/utils';

type Weight = number;
type Quantity = number;
type Limit = number;
type Capacity = number;
type Value = number;
export type Combination = Quantity[];
export type EvaluationFunction = (combination: Combination) => Value;
type CombinationFilter = (combination: Combination) => boolean;

export class Knapsack {
    #itemWeights: Weight[];
    #itemLimit: Limit;
    #totalCapacity: Capacity;

    constructor(itemWeights: Weight[], itemLimit: Limit, totalCapacity: Capacity) {
        this.#itemWeights = itemWeights;
        this.#itemLimit = itemLimit;
        this.#totalCapacity = totalCapacity;
    }

    #calculateSingleItemCombination(itemWeight: Weight, leftoverCapacity: Capacity): Combination[] {
        const itemAmountToFillCapacity = leftoverCapacity / itemWeight;

        if (
            Number.isInteger(itemAmountToFillCapacity)
            && itemAmountToFillCapacity <= this.#itemLimit
        ) {
            return [[itemAmountToFillCapacity]];
        }

        return [];
    }

    #findAllSubCombinations = memoize(
        (
            [currentItemWeight, ...otherItemWeights]: Weight[],
            leftoverCapacity: Capacity,
        ): Combination[] => {
            if (!otherItemWeights.length) {
                return this.#calculateSingleItemCombination(currentItemWeight, leftoverCapacity);
            }

            const combinations: Combination[] = [];

            for (
                let currentItemAmount = 0;
                currentItemAmount <= this.#itemLimit;
                currentItemAmount++
            ) {
                const currentlyAllocatedCapacity = currentItemAmount * currentItemWeight;

                if (currentlyAllocatedCapacity > leftoverCapacity) {
                    break;
                }

                const subCombinations = this.#findAllSubCombinations(
                    otherItemWeights,
                    leftoverCapacity - currentlyAllocatedCapacity,
                ).map((combination) => [currentItemAmount, ...combination]);
                combinations.push(...subCombinations);
            }

            return combinations;
        },
    );

    findAllCombinations(combinationFilter?: CombinationFilter): Combination[] {
        const allCombinations = this.#findAllSubCombinations(
            this.#itemWeights,
            this.#totalCapacity,
        );

        if (combinationFilter) {
            return allCombinations.filter(combinationFilter);
        }

        return allCombinations;
    }

    findBestValue(
        evaluationFunction: EvaluationFunction,
        combinationFilter?: CombinationFilter,
    ): Value {
        const allCombinations = this.findAllCombinations(combinationFilter);
        return allCombinations.reduce(
            (bestValue, combination) => Math.max(bestValue, evaluationFunction(combination)),
            0,
        );
    }
}

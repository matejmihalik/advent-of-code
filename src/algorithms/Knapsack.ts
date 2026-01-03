import { memoize } from '#src/utils';

type Quantity = number;
type Limit = number;
type Capacity = number;
type Value = number;
export type Combination = Quantity[];
export type EvaluationFunction = (combination: Combination) => Value;
type CombinationFilter = (combination: Combination) => boolean;

export class Knapsack {
    #totalCapacity: Capacity;
    #items: Capacity[];
    #itemLimit: Limit;

    constructor(totalCapacity: Capacity, items: Capacity[], itemLimit = 1) {
        this.#totalCapacity = totalCapacity;
        this.#items = items;
        this.#itemLimit = itemLimit;
    }

    #calculateSingleItemCombination(item: Capacity, leftoverCapacity: Capacity): Combination[] {
        const itemAmountToFillCapacity = leftoverCapacity / item;

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
            [currentItem, ...otherItems]: Capacity[],
            leftoverCapacity: Capacity,
        ): Combination[] => {
            if (!otherItems.length) {
                return this.#calculateSingleItemCombination(currentItem, leftoverCapacity);
            }

            const combinations: Combination[] = [];

            for (
                let currentItemAmount = 0;
                currentItemAmount <= this.#itemLimit;
                currentItemAmount++
            ) {
                const currentlyAllocatedCapacity = currentItemAmount * currentItem;

                if (currentlyAllocatedCapacity > leftoverCapacity) {
                    break;
                }

                const subCombinations = this.#findAllSubCombinations(
                    otherItems,
                    leftoverCapacity - currentlyAllocatedCapacity,
                ).map((combination) => [currentItemAmount, ...combination]);
                combinations.push(...subCombinations);
            }

            return combinations;
        },
    );

    findAllCombinations(combinationFilter?: CombinationFilter): Combination[] {
        const allCombinations = this.#findAllSubCombinations(
            this.#items,
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
        return allCombinations.reduce((bestValue, combination) =>
            Math.max(bestValue, evaluationFunction(combination)),
        0);
    }
}

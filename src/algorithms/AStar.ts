import { MinimumPriorityBucketQueue } from './MinimumPriorityBucketQueue';
import { type HeuristicFunction, type StateExplorationFunction } from './Search';

export class AStar<T> {
    #heuristicFunction: HeuristicFunction<T>;
    #stateExplorationFunction: StateExplorationFunction<T>;
    #priorityQueue = new MinimumPriorityBucketQueue<T>();
    #minimalDistanceMap = new Map<T, number>();

    constructor(
        initialState: T,
        heuristicFunction: HeuristicFunction<T>,
        stateExplorationFunction: StateExplorationFunction<T>,
    ) {
        this.#heuristicFunction = heuristicFunction;
        this.#stateExplorationFunction = stateExplorationFunction;
        this.#priorityQueue.push(initialState, heuristicFunction(initialState));
        this.#minimalDistanceMap.set(initialState, 0);
    }

    #getMinimumDistanceToState(state: T): number {
        return this.#minimalDistanceMap.get(state) ?? Infinity;
    }

    #exploreNeighbouringStates(originState: T): void {
        this.#stateExplorationFunction(originState).forEach((followUpState) => {
            const minimumDistanceToState = this.#getMinimumDistanceToState(originState) + 1;

            if (minimumDistanceToState < this.#getMinimumDistanceToState(followUpState)) {
                this.#minimalDistanceMap.set(followUpState, minimumDistanceToState);
                this.#priorityQueue.push(
                    followUpState,
                    minimumDistanceToState + this.#heuristicFunction(followUpState),
                );
            }
        });
    }

    findMinimumDistanceToGoal(goalState: T): number {
        let currentState: T | undefined;

        while ((currentState = this.#priorityQueue.pop())) {
            if (currentState === goalState) {
                return this.#getMinimumDistanceToState(currentState);
            }

            this.#exploreNeighbouringStates(currentState);
        }

        return Infinity;
    }
}

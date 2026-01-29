export type HeuristicFunction<T> = (state: T) => number;
export type StateExplorationFunction<T> = (state: T) => T[];

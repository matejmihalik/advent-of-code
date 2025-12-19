export type Node = string;
export type Edge = number;
export type Graph = Map<Node, Map<Node, Edge>>;

export type Distance = number;
type Fitness = number;
export type DistanceFitnessFunction = (distance: Distance) => Fitness;

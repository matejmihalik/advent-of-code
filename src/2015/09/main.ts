// --- Day 9: All in a Single Night ---
// https://adventofcode.com/2015/day/9
// https://www.reddit.com/r/adventofcode/comments/3w192e/day_9_solutions

import {
    BestOpenPath,
    type Distance,
    type DistanceFitnessFunction,
    type Graph,
    type Node,
} from '#src/algorithms';
import { InputReader } from '#src/input';

const ROUTES = new InputReader(import.meta.dirname).readAsLines();

function setLocationDistance(
    graph: Graph,
    origin: Node,
    destination: Node,
    distance: Distance,
): void {
    let originDestinations = graph.get(origin);

    if (!originDestinations) {
        originDestinations = new Map();
        graph.set(origin, originDestinations);
    }

    originDestinations.set(destination, distance);
}

const LOCATION_GRAPH = ROUTES.reduce<Graph>((locationGraph, route) => {
    const [, origin, destination, distance]
        = route.match(/^(?<start>\w+) to (?<destination>\w+) = (?<distance>\d+)$/) ?? [];

    const numericDistance = Number(distance);

    setLocationDistance(locationGraph, origin, destination, numericDistance);
    setLocationDistance(locationGraph, destination, origin, numericDistance);

    return locationGraph;
}, new Map());

export function partOne(): number {
    const fitnessFunction: DistanceFitnessFunction = (distance) => -distance;
    const bestOpenPath = new BestOpenPath(LOCATION_GRAPH, fitnessFunction);
    return bestOpenPath.findBestDistance();
}

export function partTwo(): number {
    const fitnessFunction: DistanceFitnessFunction = (distance) => distance;
    const bestOpenPath = new BestOpenPath(LOCATION_GRAPH, fitnessFunction);
    return bestOpenPath.findBestDistance();
}

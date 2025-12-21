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
    let originDistances = graph.get(origin);

    if (!originDistances) {
        originDistances = new Map();
        graph.set(origin, originDistances);
    }

    originDistances.set(destination, distance);
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
    const preferMinimumDistance: DistanceFitnessFunction = (distance) => -distance;
    const bestOpenPath = new BestOpenPath(LOCATION_GRAPH, preferMinimumDistance);
    return bestOpenPath.findBestDistance();
}

export function partTwo(): number {
    const preferMaximumDistance: DistanceFitnessFunction = (distance) => distance;
    const bestOpenPath = new BestOpenPath(LOCATION_GRAPH, preferMaximumDistance);
    return bestOpenPath.findBestDistance();
}

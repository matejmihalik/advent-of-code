// --- Day 9: All in a Single Night ---
// https://adventofcode.com/2015/day/9

import { InputReader } from '#src/InputReader.ts';

const inputReader = new InputReader(import.meta.url);
const routes = inputReader.readAsLines();

type DistanceMap = Map<string, Map<string, number>>;

type FitnessFunction = (distance?: number) => number;

function setDistanceToMap(
    map: DistanceMap,
    startLocation: string,
    targetLocation: string,
    distance: number,
): void {
    let startLocationMap = map.get(startLocation);

    if (!startLocationMap) {
        startLocationMap = new Map();
        map.set(startLocation, startLocationMap);
    }

    startLocationMap.set(targetLocation, distance);
}

const DISTANCE_MAP = routes.reduce<DistanceMap>((distanceMap, route) => {
    const routeMatch = route.match(
        /^(?<startLocation>\w+) to (?<endLocation>\w+) = (?<distance>\d+)$/,
    );

    if (!routeMatch?.groups) {
        return distanceMap;
    }

    const { startLocation, endLocation, distance } = routeMatch.groups;

    setDistanceToMap(distanceMap, startLocation, endLocation, Number(distance));
    setDistanceToMap(distanceMap, endLocation, startLocation, Number(distance));

    return distanceMap;
}, new Map());

const ALL_LOCATIONS = Array.from(DISTANCE_MAP.keys());

function getBestDistanceBetweenLocations(
    fitnessFunction: FitnessFunction,
    locations: string[],
    startingLocation?: string,
): number | undefined {
    return locations.reduce<number | undefined>(
        (bestDistance, immediateLocation, immediateLocationIndex) => {
            const otherTargetLocations = [...locations];
            otherTargetLocations.splice(immediateLocationIndex, 1);

            const immediateDistance = startingLocation
                ? DISTANCE_MAP.get(startingLocation)?.get(immediateLocation) ?? 0
                : 0;

            const remainingBestDistance =
                getBestDistanceBetweenLocations(
                    fitnessFunction,
                    otherTargetLocations,
                    immediateLocation,
                ) ?? 0;

            const distance = immediateDistance + remainingBestDistance;

            return fitnessFunction(distance) > fitnessFunction(bestDistance)
                ? distance
                : bestDistance;
        },
        undefined,
    );
}

export function partOne() {
    const fitnessFunction: FitnessFunction = (distance) => -(distance ?? Infinity);
    return getBestDistanceBetweenLocations(fitnessFunction, ALL_LOCATIONS);
}

export function partTwo() {
    const fitnessFunction: FitnessFunction = (distance) => distance ?? 0;
    return getBestDistanceBetweenLocations(fitnessFunction, ALL_LOCATIONS);
}

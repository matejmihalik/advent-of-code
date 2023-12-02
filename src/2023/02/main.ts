// --- Day 2: Cube Conundrum ---
// https://adventofcode.com/2023/day/2

import { InputReader } from '#src/InputReader.ts';

const RAW_GAMES = new InputReader(import.meta.url).readAsLines();

type CubeSet = Map<string, number>;

interface Game {
    id: number;
    revealedSets: CubeSet[];
}

const GAMES = RAW_GAMES.reduce<Game[]>((games, rawGame) => {
    const gameMatch = rawGame.match(/^Game (?<id>\d+): (?<cubeSets>.*)$/);

    if (!gameMatch?.groups) {
        return games;
    }

    const { id, cubeSets } = gameMatch.groups;

    const revealedSets = cubeSets.split('; ').map(
        (cubeSet) =>
            new Map(
                cubeSet.split(', ').map((cubeCount) => {
                    const [amount, color] = cubeCount.split(' ');
                    return [color, Number(amount)];
                }),
            ),
    );

    games.push({ id: Number(id), revealedSets });

    return games;
}, []);

function isGamePossibleWithGivenBag({ revealedSets }: Game, bag: CubeSet): boolean {
    return revealedSets.every((set) =>
        Array.from(set.entries()).every(
            ([cubeColor, cubeAmount]) => cubeAmount <= (bag.get(cubeColor) ?? 0),
        ),
    );
}

export function partOne(): number {
    const bag: CubeSet = new Map([
        ['red', 12],
        ['green', 13],
        ['blue', 14],
    ]);

    return GAMES.filter((game) => isGamePossibleWithGivenBag(game, bag)).reduce(
        (sum, { id }) => sum + id,
        0,
    );
}

function findMinimalCubeSetForGame({ revealedSets }: Game): CubeSet {
    return revealedSets.reduce((minimalCubeSet, revealedSet) => {
        Array.from(revealedSet.entries()).forEach(([cubeColor, cubeAmount]) => {
            const minimalCubeAmount = minimalCubeSet.get(cubeColor) ?? 0;
            if (cubeAmount > minimalCubeAmount) {
                minimalCubeSet.set(cubeColor, cubeAmount);
            }
        });

        return minimalCubeSet;
    }, new Map());
}

function calculateCubeSetPower(cubeSet: CubeSet): number {
    return Array.from(cubeSet.values()).reduce((sum, cubeAmount) => sum * cubeAmount, 1);
}

export function partTwo(): number {
    return GAMES.map(findMinimalCubeSetForGame).reduce(
        (sum, minimalCubeSet) => sum + calculateCubeSetPower(minimalCubeSet),
        0,
    );
}

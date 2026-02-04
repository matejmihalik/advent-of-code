// --- Day 20: Infinite Elves and Infinite Houses ---
// https://adventofcode.com/2015/day/20
// https://www.reddit.com/r/adventofcode/comments/3xjpp2/day_20_solutions

import { divisorSum, sieveOfEratosthenes } from '#src/algorithms';
import { InputReader } from '#src/input';

const PRESENT_TARGET = new InputReader(import.meta.dirname).readAsNumber();

function findFirstHouseNumberWithDivisorSum(target: number): number {
    const primes = sieveOfEratosthenes(Math.ceil(Math.sqrt(target)));

    let currentHouseNumber = 1;

    while (divisorSum(currentHouseNumber, primes) < target) {
        currentHouseNumber++;
    }

    return currentHouseNumber;
}

export function partOne(): number {
    const presentMultiplier = 10;
    const target = Math.ceil(PRESENT_TARGET / presentMultiplier);

    return findFirstHouseNumberWithDivisorSum(target);
}

function deliverPresents(houses: number[], elfStamina: number): void {
    for (let elfIndex = 1; elfIndex < houses.length; elfIndex++) {
        for (
            let houseIndex = elfIndex;
            houseIndex <= Math.min(elfIndex * elfStamina, houses.length - 1);
            houseIndex += elfIndex
        ) {
            houses[houseIndex] += elfIndex;
        }
    }
}

export function partTwo(): number {
    const presentMultiplier = 11;
    const elfStamina = 50;
    const target = Math.ceil(PRESENT_TARGET / presentMultiplier);

    const houses = Array<number>(target + 1).fill(0);

    deliverPresents(houses, elfStamina);

    return houses.findIndex((presents) => presents >= target);
}

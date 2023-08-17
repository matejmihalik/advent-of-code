// --- Day 20: Infinite Elves and Infinite Houses ---
// https://adventofcode.com/2015/day/20

import { InputReader } from '#src/InputReader.ts';

const TARGET_PRESENT_COUNT = new InputReader(import.meta.url).readAsNumber();

function hasElfStaminaRemaining(
    houseNumber: number,
    elfNumber: number,
    elfStamina = Infinity,
): boolean {
    return houseNumber <= elfNumber * elfStamina;
}

function findAllVisitingElves(houseNumber: number, elfStamina?: number): number[] {
    const visitingElves = [];

    for (let lowerElfNumber = 1; lowerElfNumber <= Math.sqrt(houseNumber); lowerElfNumber++) {
        const doesElfDeliverToHouse = houseNumber % lowerElfNumber === 0;

        if (doesElfDeliverToHouse) {
            if (hasElfStaminaRemaining(houseNumber, lowerElfNumber, elfStamina)) {
                visitingElves.push(lowerElfNumber);
            }

            const higherElfNumber = houseNumber / lowerElfNumber;
            if (
                lowerElfNumber !== higherElfNumber &&
                hasElfStaminaRemaining(houseNumber, higherElfNumber, elfStamina)
            ) {
                visitingElves.push(higherElfNumber);
            }
        }
    }

    return visitingElves;
}

function calculatePresentTotalForHouse(houseNumber: number, elfStamina?: number): number {
    const visitingElves = findAllVisitingElves(houseNumber, elfStamina);
    return visitingElves.reduce((giftTotal, currentElfNumber) => giftTotal + currentElfNumber, 0);
}

function findFirstHouseWithGiftTotal(presentTarget: number, elfStamina?: number): number {
    let currentHouseNumber = 1;

    while (calculatePresentTotalForHouse(currentHouseNumber, elfStamina) < presentTarget) {
        currentHouseNumber++;
    }

    return currentHouseNumber;
}

export function partOne(): number {
    const elfPresentMultiplier = 10;
    const presentTarget = TARGET_PRESENT_COUNT / elfPresentMultiplier;

    return findFirstHouseWithGiftTotal(presentTarget);
}

export function partTwo(): number {
    const elfPresentMultiplier = 11;
    const elfStamina = 50;
    const presentTarget = TARGET_PRESENT_COUNT / elfPresentMultiplier;

    return findFirstHouseWithGiftTotal(presentTarget, elfStamina);
}

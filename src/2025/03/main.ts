// --- Day 3: Lobby ---
// https://adventofcode.com/2025/day/3
// https://www.reddit.com/r/adventofcode/comments/1pcvaj4/2025_day_3_solutions

import { InputReader } from '#src/input';

const BANKS = new InputReader(import.meta.dirname).readAsLines();

function findBiggestBattery(batteries: string[]): string {
    const biggestNumericBattery = batteries.reduce((biggestBattery, currentBattery) =>
        Math.max(biggestBattery, Number(currentBattery)),
    0);

    return String(biggestNumericBattery);
}

function findBiggestBatteries(batteries: string[], batteriesToTurnOn: number): string[] {
    if (batteriesToTurnOn === 1) {
        const biggestBattery = findBiggestBattery(batteries);
        return [biggestBattery];
    }

    const availableBatteries = batteries.slice(0, -batteriesToTurnOn + 1);
    const biggestBattery = findBiggestBattery(availableBatteries);

    const biggestBatteryIndex = batteries.indexOf(biggestBattery);
    const remainingBatteries = batteries.slice(biggestBatteryIndex + 1);

    const subsequentBiggestBatteries
        = findBiggestBatteries(remainingBatteries, batteriesToTurnOn - 1);

    return [biggestBattery, ...subsequentBiggestBatteries];
}

function getMaximumBankJoltage(bank: string, batteriesToTurnOn: number): number {
    const batteries = bank.split('');
    const biggestBatteries = findBiggestBatteries(batteries, batteriesToTurnOn);
    const maximumBankJoltage = biggestBatteries.join('');

    return Number(maximumBankJoltage);
}

function turnOnBatteries(batteriesToTurnOn: number): number {
    return BANKS.reduce((totalJoltage, bank) =>
        totalJoltage + getMaximumBankJoltage(bank, batteriesToTurnOn),
    0);
}

export function partOne(): number {
    const batteriesToTurnOn = 2;
    return turnOnBatteries(batteriesToTurnOn);
}

export function partTwo(): number {
    const batteriesToTurnOn = 12;
    return turnOnBatteries(batteriesToTurnOn);
}

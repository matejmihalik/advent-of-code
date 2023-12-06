// --- Day 6: Wait For It ---
// https://adventofcode.com/2023/day/6

import { InputReader } from '#src/InputReader.ts';

const [RAW_TIMES, RAW_DISTANCES] = new InputReader(import.meta.url).readAsLines();

interface Race {
    time: number;
    distance: number;
}

const TIMES: string[] = RAW_TIMES.match(/\d+/g) ?? [];
const DISTANCES: string[] = RAW_DISTANCES.match(/\d+/g) ?? [];

function countWinningStrategies({ time, distance }: Race): number {
    const timeDelta = Math.sqrt(time ** 2 - 4 * distance);
    const minWinningButtonPressTime = Math.ceil((time - timeDelta) / 2);
    const maxWinningButtonPressTime = Math.floor((time + timeDelta) / 2);

    return maxWinningButtonPressTime - minWinningButtonPressTime + 1;
}

export function partOne(): number {
    const races: Race[] = TIMES.map((time, index) => ({
        time: Number(time),
        distance: Number(DISTANCES[index]),
    }));

    const winningStrategiesCounts = races.map(countWinningStrategies);

    return winningStrategiesCounts.reduce(
        (accumulator, winningStrategyCount) => accumulator * winningStrategyCount,
        1,
    );
}

export function partTwo(): number {
    const totalRaceTime = TIMES.reduce((totalTime, currentTime) => totalTime + currentTime);
    const totalRaceDistance = DISTANCES.reduce(
        (totalDistance, currentDistance) => totalDistance + currentDistance,
    );

    const race: Race = {
        time: Number(totalRaceTime),
        distance: Number(totalRaceDistance),
    };

    return countWinningStrategies(race);
}

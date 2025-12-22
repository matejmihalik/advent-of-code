// --- Day 14: Reindeer Olympics ---
// https://adventofcode.com/2015/day/14
// https://www.reddit.com/r/adventofcode/comments/3wqtx2/day_14_solutions

import { InputReader } from '#src/input';

interface Reindeer {
    name: string;
    speed: number;
    flyingPhaseDuration: number;
    restingPhaseDuration: number;
}

type Scoreboard = Map<string, number>;

const RACE_DURATION = 2503;

function parseReindeer(reindeer: string): Reindeer {
    const [, name, speed, flyingPhaseDuration, restingPhaseDuration]
        = reindeer.match(
            /^(?<name>\w+) can fly (?<speed>\d+) km\/s for (?<flyingPhaseDuration>\d+) seconds, but then must rest for (?<restingPhaseDuration>\w+) seconds.$/,
        ) ?? [];

    return {
        name,
        speed: Number(speed),
        flyingPhaseDuration: Number(flyingPhaseDuration),
        restingPhaseDuration: Number(restingPhaseDuration),
    };
}

const REINDEERS = new InputReader(import.meta.dirname).readAsLines(parseReindeer);

function calculateReindeerDistance(
    { speed, flyingPhaseDuration, restingPhaseDuration }: Reindeer,
    duration: number,
): number {
    const fullCycleDuration = flyingPhaseDuration + restingPhaseDuration;
    const fullCyclesExperienced = Math.floor(duration / fullCycleDuration);
    const timeSpentFlyingInFullCycles = flyingPhaseDuration * fullCyclesExperienced;

    const timeSpentInPartialCycle = duration % fullCycleDuration;
    const timeSpentFlyingInPartialCycle = Math.min(timeSpentInPartialCycle, flyingPhaseDuration);

    return (timeSpentFlyingInFullCycles + timeSpentFlyingInPartialCycle) * speed;
}

export function partOne(): number {
    const finalStandings = REINDEERS.map((reindeer) =>
        calculateReindeerDistance(reindeer, RACE_DURATION),
    );

    return Math.max(...finalStandings);
}

function getLeadingReindeers(standings: Scoreboard): string[] {
    return standings.entries().reduce<string[]>((leaders, [reindeer, currentReindeerDistance]) => {
        const topDistance = standings.get(leaders[0]) ?? 0;

        if (currentReindeerDistance > topDistance) {
            return [reindeer];
        }

        if (currentReindeerDistance === topDistance) {
            leaders.push(reindeer);
        }

        return leaders;
    },
    []);
}

function scoreReindeers(scoreboard: Scoreboard, secondsElapsed: number): void {
    const currentStandings: Scoreboard = new Map(REINDEERS.map((reindeer) => [
        reindeer.name,
        calculateReindeerDistance(reindeer, secondsElapsed),
    ]));

    const leadingReindeers = getLeadingReindeers(currentStandings);

    leadingReindeers.forEach((reindeer) => {
        const currentReindeerScore = scoreboard.get(reindeer) ?? 0;
        scoreboard.set(reindeer, currentReindeerScore + 1);
    });
}

export function partTwo(): number {
    const scoreboard: Scoreboard = new Map();

    for (let secondsElapsed = 1; secondsElapsed <= RACE_DURATION; secondsElapsed++) {
        scoreReindeers(scoreboard, secondsElapsed);
    }

    return Math.max(...scoreboard.values());
}

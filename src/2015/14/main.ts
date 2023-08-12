// --- Day 14: Reindeer Olympics ---
// https://adventofcode.com/2015/day/14

import { InputReader } from '#src/InputReader.ts';

const REINDEER_DESCRIPTIONS = new InputReader(import.meta.url).readAsLines();

interface ReindeerStats {
    speed: number;
    flyingPhaseDuration: number;
    restingPhaseDuration: number;
}

type ReindeerStatsMap = Map<string, ReindeerStats>;

type Scoreboard = Map<string, number>;

const RACE_DURATION = 2503;

const REINDEER_STATS = REINDEER_DESCRIPTIONS.reduce<ReindeerStatsMap>(
    (reindeerStatsMap, reindeerDescription) => {
        const descriptionMatch = reindeerDescription.match(
            /^(?<reindeer>\w+) can fly (?<speed>\d+) km\/s for (?<flyingPhaseDuration>\d+) seconds, but then must rest for (?<restingPhaseDuration>\w+) seconds.$/,
        );

        if (!descriptionMatch?.groups) {
            return reindeerStatsMap;
        }

        const { reindeer, speed, flyingPhaseDuration, restingPhaseDuration } =
            descriptionMatch.groups;

        reindeerStatsMap.set(reindeer, {
            speed: Number(speed),
            flyingPhaseDuration: Number(flyingPhaseDuration),
            restingPhaseDuration: Number(restingPhaseDuration),
        });

        return reindeerStatsMap;
    },
    new Map(),
);

function race(
    { speed, flyingPhaseDuration, restingPhaseDuration }: ReindeerStats,
    raceDuration: number,
): number {
    const fullCycleDuration = flyingPhaseDuration + restingPhaseDuration;
    const fullCyclesExperienced = Math.floor(raceDuration / fullCycleDuration);
    const timeSpentFlyingInFullCycles = flyingPhaseDuration * fullCyclesExperienced;

    const timeSpentInPartialCycle = raceDuration % fullCycleDuration;
    const timeSpentFlyingInPartialCycle = Math.min(timeSpentInPartialCycle, flyingPhaseDuration);

    return (timeSpentFlyingInFullCycles + timeSpentFlyingInPartialCycle) * speed;
}

export function partOne(): number {
    const finalStandings = Array.from(REINDEER_STATS.values()).map((reindeer) =>
        race(reindeer, RACE_DURATION),
    );
    return Math.max(...finalStandings);
}

function createScoreboard(getDefaultScore?: (reindeer: ReindeerStats) => number): Scoreboard {
    return Array.from(REINDEER_STATS.entries()).reduce<Scoreboard>(
        (scoreboard, [reindeer, reindeerStats]) => {
            scoreboard.set(reindeer, getDefaultScore?.(reindeerStats) ?? 0);
            return scoreboard;
        },
        new Map(),
    );
}

function getLeadingReindeers(standings: Scoreboard): string[] {
    const topDistance = Math.max(...Array.from(standings.values()));

    return Array.from(standings.entries()).reduce<string[]>(
        (leaders, [reindeer, currentDistance]) =>
            currentDistance === topDistance ? [...leaders, reindeer] : leaders,
        [],
    );
}

function scoreReindeers(scoreboard: Scoreboard, secondsElapsed: number) {
    const currentStandings = createScoreboard((reindeerStats) =>
        race(reindeerStats, secondsElapsed),
    );

    const leadingReindeers = getLeadingReindeers(currentStandings);

    leadingReindeers.forEach((reindeer) =>
        scoreboard.set(reindeer, (scoreboard.get(reindeer) ?? 0) + 1),
    );
}

export function partTwo(): number {
    const scoreboard = createScoreboard();

    for (let secondsElapsed = 1; secondsElapsed <= RACE_DURATION; secondsElapsed++) {
        scoreReindeers(scoreboard, secondsElapsed);
    }

    return Math.max(...Array.from(scoreboard.values()));
}

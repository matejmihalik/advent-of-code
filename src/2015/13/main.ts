// --- Day 13: Knights of the Dinner Table ---
// https://adventofcode.com/2015/day/13
// https://www.reddit.com/r/adventofcode/comments/3wm0oy/day_13_solutions

import { InputReader } from '#src/input';
import {
    BestOpenPath,
    type Distance,
    type DistanceFitnessFunction,
    type Graph,
    HeldKarp,
    type Node,
} from '#src/algorithms';

enum Sentiment {
    Dislikes = 'lose',
    Likes = 'gain',
}

const SEATING_PREFERENCES = new InputReader(import.meta.dirname).readAsLines();

function setAttendeeHappiness(
    graph: Graph,
    attendee: Node,
    neighbour: Node,
    happiness: Distance,
): void {
    let attendeeHappiness = graph.get(attendee);

    if (!attendeeHappiness) {
        attendeeHappiness = new Map();
        graph.set(attendee, attendeeHappiness);
    }

    const existingHappiness = attendeeHappiness.get(neighbour) ?? 0;
    attendeeHappiness.set(neighbour, existingHappiness + happiness);
}

function getSentimentModifier(sentiment: Sentiment): number {
    if (sentiment === Sentiment.Likes) {
        return 1;
    }

    if (sentiment === Sentiment.Dislikes) {
        return -1;
    }

    return 0;
}

const HAPPINESS_GRAPH = SEATING_PREFERENCES.reduce<Graph>((happinessGraph, affinity) => {
    const [, attendee, sentiment, happiness, neighbour]
        = affinity.match(
            /^(?<attendee>\w+) would (?<sentiment>lose|gain) (?<happiness>\d+) happiness units by sitting next to (?<neighbour>\w+).$/,
        ) ?? [];

    const happinessDelta = Number(happiness) * getSentimentModifier(sentiment as Sentiment);

    setAttendeeHappiness(happinessGraph, attendee, neighbour, happinessDelta);
    setAttendeeHappiness(happinessGraph, neighbour, attendee, happinessDelta);

    return happinessGraph;
}, new Map());

const preferMaximumHappiness: DistanceFitnessFunction = (happiness) => happiness;

export function partOne(): number {
    const heldKarp = new HeldKarp(HAPPINESS_GRAPH, preferMaximumHappiness);
    return heldKarp.findBestDistance();
}

export function partTwo(): number {
    const bestOpenPath = new BestOpenPath(HAPPINESS_GRAPH, preferMaximumHappiness);
    return bestOpenPath.findBestDistance();
}

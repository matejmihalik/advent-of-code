// --- Day 13: Knights of the Dinner Table ---
// https://adventofcode.com/2015/day/13

import { InputReader } from '#src/InputReader.ts';

const inputReader = new InputReader(import.meta.url);
const seatingPreferences = inputReader.readAsLines();

type AffinityMap = Map<string, Map<string, number>>;

function setAffinityToMap(
    map: AffinityMap,
    attendee: string,
    neighbour: string,
    affinity: number,
): void {
    let attendeeMap = map.get(attendee);

    if (!attendeeMap) {
        attendeeMap = new Map();
        map.set(attendee, attendeeMap);
    }

    attendeeMap.set(neighbour, affinity);
}

const AFFINITY_MAP = seatingPreferences.reduce<AffinityMap>((affinityMap, relationship) => {
    const relationshipMatch = relationship.match(
        /^(?<attendee>\w+) would (?<sentiment>lose|gain) (?<happinessUnits>\d+) happiness units by sitting next to (?<neighbour>\w+).$/,
    );

    if (!relationshipMatch?.groups) {
        return affinityMap;
    }

    const { attendee, neighbour, sentiment, happinessUnits } = relationshipMatch.groups;

    const affinity = Number(happinessUnits) * (sentiment === 'lose' ? -1 : 1);
    setAffinityToMap(affinityMap, attendee, neighbour, affinity);

    return affinityMap;
}, new Map());

const ALL_ATTENDEES = Array.from(AFFINITY_MAP.keys());

function getAllPossibleSeatingArrangements(attendees: string[]): string[][] {
    const [currentAttendee, ...otherAttendees] = attendees;

    if (!otherAttendees.length) {
        return [[currentAttendee]];
    }

    return getAllPossibleSeatingArrangements(otherAttendees).flatMap((arrangement) => {
        const arrangementsWithCurrentAttendee = [];
        for (let position = 0; position <= arrangement.length; position++) {
            const arrangementWithCurrentAttendee = [...arrangement];
            arrangementWithCurrentAttendee.splice(position, 0, currentAttendee);
            arrangementsWithCurrentAttendee.push(arrangementWithCurrentAttendee);
        }
        return arrangementsWithCurrentAttendee;
    });
}

function calculateArrangementHappinessDelta(arrangement: string[]): number {
    return arrangement.reduce((happinessDelta, attendee, attendeeIndex) => {
        const neighbour = arrangement[attendeeIndex + 1] ?? arrangement[0];
        const attendeeAffinity = AFFINITY_MAP.get(attendee)?.get(neighbour) ?? 0;
        const neighbourAffinity = AFFINITY_MAP.get(neighbour)?.get(attendee) ?? 0;

        return happinessDelta + attendeeAffinity + neighbourAffinity;
    }, 0);
}

function findBestSeatingArrangement(arrangements: string[][]) {
    return arrangements
        .map(calculateArrangementHappinessDelta)
        .reduce(
            (highestHappinessDelta, currentHappinessDelta) =>
                currentHappinessDelta > highestHappinessDelta
                    ? currentHappinessDelta
                    : highestHappinessDelta,
            -Infinity,
        );
}

export function partOne(): number {
    const seatingArrangements = getAllPossibleSeatingArrangements(ALL_ATTENDEES);
    return findBestSeatingArrangement(seatingArrangements);
}

export function partTwo(): number {
    const seatingArrangements = getAllPossibleSeatingArrangements([...ALL_ATTENDEES, 'Myself']);
    return findBestSeatingArrangement(seatingArrangements);
}

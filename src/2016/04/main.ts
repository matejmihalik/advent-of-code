// --- Day 4: Security Through Obscurity ---
// https://adventofcode.com/2016/day/4

import { InputReader } from '#src/InputReader.ts';

const RAW_ROOMS = new InputReader(import.meta.url).readAsLines();

interface Room {
    name: string;
    sectorId: number;
    checksum: string;
}

const CHECKSUM_LENGTH = 5;
const MIN_LETTER_VALUE = 'a'.charCodeAt(0);
const MAX_LETTER_VALUE = 'z'.charCodeAt(0);

const ROOMS = RAW_ROOMS.reduce<Room[]>((rooms, rawRoom) => {
    const rawRoomMatch = rawRoom.match(
        /^(?<name>[a-z-]+)-(?<sectorId>\d+)\[(?<checksum>[a-z]+)\]$/,
    );

    if (!rawRoomMatch?.groups) {
        return rooms;
    }

    const { name, sectorId, checksum } = rawRoomMatch.groups;

    rooms.push({
        name,
        checksum,
        sectorId: Number(sectorId),
    });

    return rooms;
}, []);

function buildLetterHistogram(letters: string[]): Map<string, number> {
    return letters.reduce((histogram, letter) => {
        const currentHits = histogram.get(letter) ?? 0;
        histogram.set(letter, currentHits + 1);

        return histogram;
    }, new Map<string, number>());
}

function letterHitsComparator(
    [letterA, hitsA]: [string, number],
    [letterB, hitsB]: [string, number],
): number {
    const hitDifference = hitsB - hitsA;

    if (hitDifference) {
        return hitDifference;
    }

    return letterA.localeCompare(letterB);
}

function sortLettersByOccurrence(word: string): string[] {
    const letterHistogram = buildLetterHistogram(word.split(''));

    return Array.from(letterHistogram.entries())
        .sort(letterHitsComparator)
        .map(([letter]) => letter);
}

function buildRoomChecksum(roomName: string): string {
    const normalizedRoomName = roomName.replaceAll('-', '');
    const prioritizedLetters = sortLettersByOccurrence(normalizedRoomName);

    return prioritizedLetters.slice(0, CHECKSUM_LENGTH).join('');
}

function isRoomReal({ name, checksum }: Room): boolean {
    return buildRoomChecksum(name) === checksum;
}

function sumSectorIds(rooms: Room[]): number {
    return rooms.reduce((sum, { sectorId }) => sum + sectorId, 0);
}

export function partOne(): number {
    const realRooms = ROOMS.filter(isRoomReal);
    return sumSectorIds(realRooms);
}

function shiftLetter(letter: string, offset: number): string {
    return String.fromCharCode(
        ((letter.charCodeAt(0) + offset - MIN_LETTER_VALUE) %
            (MAX_LETTER_VALUE - MIN_LETTER_VALUE + 1)) +
            MIN_LETTER_VALUE,
    );
}

function decryptRoom({ name, sectorId, checksum }: Room): Room {
    const decryptedName = name
        .split('')
        .map((letter) => {
            if (letter === '-') {
                return ' ';
            }

            return shiftLetter(letter, sectorId);
        })
        .join('');

    return {
        name: decryptedName,
        sectorId,
        checksum,
    };
}

export function partTwo(): number {
    const targetRoomName = 'northpole object storage';

    const realRooms = ROOMS.filter(isRoomReal);
    const decryptedRooms = realRooms.map(decryptRoom);

    const targetRoom = decryptedRooms.find(({ name }) => name === targetRoomName);
    return targetRoom?.sectorId ?? 0;
}

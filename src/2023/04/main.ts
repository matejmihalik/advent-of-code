// --- Day 4: Scratchcards ---
// https://adventofcode.com/2023/day/4

import { InputReader } from '#src/InputReader.ts';

const RAW_SCRATCHCARDS = new InputReader(import.meta.url).readAsLines();

interface Scratchcard {
    winningNumbers: number[];
    numbersYouHave: number[];
}

const SCRATCHCARDS = RAW_SCRATCHCARDS.reduce<Scratchcard[]>((scratchcards, rawScratchcard) => {
    const scratchcardMatch = rawScratchcard.match(
        /^Card +\d+: (?<winningNumbers>.*) \| (?<numbersYouHave>.*)$/,
    );

    if (!scratchcardMatch?.groups) {
        return scratchcards;
    }

    const { winningNumbers, numbersYouHave } = scratchcardMatch.groups;

    scratchcards.push({
        winningNumbers: winningNumbers.match(/\d+/g)?.map(Number) ?? [],
        numbersYouHave: numbersYouHave.match(/\d+/g)?.map(Number) ?? [],
    });

    return scratchcards;
}, []);

function countScratchcardScoringNumbers({ winningNumbers, numbersYouHave }: Scratchcard): number {
    return numbersYouHave.filter((number) => winningNumbers.includes(number)).length;
}

function scoreScratchcardForPoints(scratchcard: Scratchcard): number {
    const scoringNumbersCount = countScratchcardScoringNumbers(scratchcard);
    return Math.floor(2 ** (scoringNumbersCount - 1));
}

export function partOne(): number {
    return SCRATCHCARDS.reduce(
        (totalPoints, scratchcard) => totalPoints + scoreScratchcardForPoints(scratchcard),
        0,
    );
}

function scoreScratchcardForMoreScratchcards(
    scratchcard: Scratchcard,
    scratchcardIndex: number,
): number[] {
    const scoringNumbersCount = countScratchcardScoringNumbers(scratchcard);

    return Array(scoringNumbersCount)
        .fill(null)
        .map((_, arrayIndex) => scratchcardIndex + arrayIndex + 1);
}

export function partTwo(): number {
    const scratchcardAmounts = Array(SCRATCHCARDS.length).fill(1);

    scratchcardAmounts.forEach((scratchcardAmount, scratchcardIndex) => {
        const wonScratchcardIndexes = scoreScratchcardForMoreScratchcards(
            SCRATCHCARDS[scratchcardIndex],
            scratchcardIndex,
        );

        wonScratchcardIndexes.forEach((wonScratchcardIndex) => {
            scratchcardAmounts[wonScratchcardIndex] += scratchcardAmount;
        });
    });

    return scratchcardAmounts.reduce((sum, scratchcardAmount) => sum + scratchcardAmount, 0);
}

// --- Day 7: Camel Cards ---
// https://adventofcode.com/2023/day/7

import { InputReader } from '#src/InputReader.ts';

const RAW_HANDS = new InputReader(import.meta.url).readAsLines();

interface Hand {
    cards: string;
    bid: number;
}

enum HandType {
    HIGH_CARD,
    ONE_PAIR,
    TWO_PAIR,
    THREE_OF_A_KIND,
    FULL_HOUSE,
    FOUR_OF_A_KIND,
    FIVE_OF_A_KIND,
}

const HANDS = RAW_HANDS.map<Hand>((rawHand) => {
    const [cards, bid] = rawHand.split(' ');
    return {
        cards,
        bid: Number(bid),
    };
});

function buildCardLabelHistogram(cards: string): Map<string, number> {
    return [...cards].reduce((histogram, cardLabel) => {
        const currentHits = histogram.get(cardLabel) ?? 0;
        histogram.set(cardLabel, currentHits + 1);

        return histogram;
    }, new Map<string, number>());
}

function getHandType({ cards }: Hand, allowJokers: boolean): HandType {
    let cardsWithoutJokers = cards;
    let jokerCount = 0;

    if (allowJokers) {
        cardsWithoutJokers = cards.replaceAll('J', '');
        jokerCount = cards.length - cardsWithoutJokers.length;
    }

    const cardLabelHistogram = buildCardLabelHistogram(cardsWithoutJokers);

    if (cardLabelHistogram.size <= 1) {
        return HandType.FIVE_OF_A_KIND;
    }

    if (Array.from(cardLabelHistogram.values()).includes(4 - jokerCount)) {
        return HandType.FOUR_OF_A_KIND;
    }

    if (
        cardLabelHistogram.size === 2 &&
        Array.from(cardLabelHistogram.values()).includes(3 - jokerCount)
    ) {
        return HandType.FULL_HOUSE;
    }

    if (
        cardLabelHistogram.size === 3 &&
        Array.from(cardLabelHistogram.values()).includes(3 - jokerCount)
    ) {
        return HandType.THREE_OF_A_KIND;
    }

    if (cardLabelHistogram.size === 3) {
        return HandType.TWO_PAIR;
    }

    if (cardLabelHistogram.size === 4) {
        return HandType.ONE_PAIR;
    }

    return HandType.HIGH_CARD;
}

function getCardStrength(card: string, allowJokers: boolean): number {
    if (allowJokers && card === 'J') {
        return -1;
    }

    const cardStrengths = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    return cardStrengths.indexOf(card);
}

function findFirstDifferingCards(
    { cards: cardsA }: Hand,
    { cards: cardsB }: Hand,
): [string, string] {
    let differingCardIndex = -1;
    let currentCardA;
    let currentCardB;

    do {
        differingCardIndex++;
        currentCardA = cardsA[differingCardIndex];
        currentCardB = cardsB[differingCardIndex];
    } while (currentCardA === currentCardB);

    return [currentCardA, currentCardB];
}

function handComparator(handA: Hand, handB: Hand, allowJokers = false): number {
    const handAType = getHandType(handA, allowJokers);
    const handBType = getHandType(handB, allowJokers);

    if (handAType !== handBType) {
        return handAType - handBType;
    }

    const [firstDifferingHandACard, firstDifferingHandBCard] = findFirstDifferingCards(
        handA,
        handB,
    );

    return (
        getCardStrength(firstDifferingHandACard, allowJokers) -
        getCardStrength(firstDifferingHandBCard, allowJokers)
    );
}

export function partOne(): number {
    const sortedHands = [...HANDS].sort(handComparator);
    return sortedHands.reduce((winnings, { bid }, index) => winnings + bid * (index + 1), 0);
}

export function partTwo(): number {
    const sortedHands = [...HANDS].sort((handA, handB) => handComparator(handA, handB, true));
    return sortedHands.reduce((winnings, { bid }, index) => winnings + bid * (index + 1), 0);
}

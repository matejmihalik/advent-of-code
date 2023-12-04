// --- Day 10: Balance Bots ---
// https://adventofcode.com/2016/day/10

import { InputReader } from '#src/InputReader.ts';

const INSTRUCTIONS = new InputReader(import.meta.url).readAsLines();

type ChipReceiverType = 'bot' | 'output';

interface ChipReceiver {
    type: ChipReceiverType;
    number: number;
}

interface Output {
    chips: number[];
}

interface Robot extends Output {
    lowChipReceiver?: ChipReceiver;
    highChipReceiver?: ChipReceiver;
}

interface Factory {
    robots: Robot[];
    outputs: Output[];
}

function initializeFactory(): Factory {
    const factory: Factory = {
        robots: [],
        outputs: [],
    };

    INSTRUCTIONS.forEach((instruction) => {
        const inputMatch = instruction.match(/^value (?<chip>\d+) goes to bot (?<bot>\d+)$/);

        if (inputMatch?.groups) {
            const { chip, bot } = inputMatch.groups;
            const robotNumber = Number(bot);

            const currentRobot = (factory.robots[robotNumber] ??= { chips: [] });
            currentRobot.chips.push(Number(chip));

            return;
        }

        const handoverMatch = instruction.match(
            /^bot (?<bot>\d+) gives low to (?<lowTargetType>bot|output) (?<lowTargetNumber>\d+) and high to (?<highTargetType>bot|output) (?<highTargetNumber>\d+)$/,
        );

        if (handoverMatch?.groups) {
            const { bot, lowTargetType, lowTargetNumber, highTargetType, highTargetNumber } =
                handoverMatch.groups;
            const robotNumber = Number(bot);

            const currentRobot = (factory.robots[robotNumber] ??= { chips: [] });

            currentRobot.lowChipReceiver = {
                type: lowTargetType as ChipReceiverType,
                number: Number(lowTargetNumber),
            };

            currentRobot.highChipReceiver = {
                type: highTargetType as ChipReceiverType,
                number: Number(highTargetNumber),
            };

            if (lowTargetType === 'output') {
                factory.outputs[Number(lowTargetNumber)] ??= { chips: [] };
            }

            if (highTargetType === 'output') {
                factory.outputs[Number(highTargetNumber)] ??= { chips: [] };
            }
        }
    });

    return factory;
}

function isRobotActive(robot: Robot): boolean {
    return robot.chips.length === 2;
}

function findChipReceiver({ type, number }: ChipReceiver, factory: Factory): Output {
    if (type === 'bot') {
        return factory.robots[number];
    }

    return factory.outputs[number];
}

function giveChip(chip: number, receiver: ChipReceiver, factory: Factory): void {
    const chipReceiver = findChipReceiver(receiver, factory);
    chipReceiver.chips.push(chip);
}

function handoverChips(factory: Factory): void {
    const activeRobots = factory.robots.filter(isRobotActive);

    activeRobots.forEach((robot) => {
        if (robot.lowChipReceiver) {
            const lowerChip = Math.min(...robot.chips);
            giveChip(lowerChip, robot.lowChipReceiver, factory);
        }

        if (robot.highChipReceiver) {
            const higherChip = Math.max(...robot.chips);
            giveChip(higherChip, robot.highChipReceiver, factory);
        }

        robot.chips = [];
    });
}

function findChipHandlerRobotNumber(
    lowerTargetChip: number,
    higherTargetChip: number,
    factory: Factory,
): number {
    let handlerRobotNumber = -1;

    do {
        handlerRobotNumber = factory.robots.findIndex(
            ({ chips }) => chips.includes(lowerTargetChip) && chips.includes(higherTargetChip),
        );

        handoverChips(factory);
    } while (handlerRobotNumber < 0);

    return handlerRobotNumber;
}

export function partOne(): number {
    const lowerTargetChip = 17;
    const higherTargetChip = 61;
    const factory = initializeFactory();

    return findChipHandlerRobotNumber(lowerTargetChip, higherTargetChip, factory);
}

function areOutputsFilled(outputs: number[], factory: Factory): boolean {
    return outputs.every((output) => factory.outputs[output].chips.length);
}

function getFirstChipsInOutputs(outputs: number[], factory: Factory): number[] {
    while (!areOutputsFilled(outputs, factory)) {
        handoverChips(factory);
    }

    return outputs.map((output) => factory.outputs[output].chips[0]);
}

export function partTwo(): number {
    const factory = initializeFactory();
    const outputs = [0, 1, 2];
    const chips = getFirstChipsInOutputs(outputs, factory);

    return chips.reduce((product, chip) => product * chip, 1);
}

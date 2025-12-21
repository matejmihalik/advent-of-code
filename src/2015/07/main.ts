// --- Day 7: Some Assembly Required ---
// https://adventofcode.com/2015/day/7
// https://www.reddit.com/r/adventofcode/comments/3vr4m4/day_7_solutions

import { InputReader } from '#src/input';

type Circuit = Map<string, string | number>;

const OUTPUT_WIRE = 'a';
const CONNECTION_SEPARATOR = ' -> ';

const INSTRUCTIONS = new InputReader(import.meta.dirname).readAsLines();

function connectWire(circuit: Circuit, instruction: string): Circuit {
    const [inputSignal, outputWire] = instruction.split(CONNECTION_SEPARATOR);
    return circuit.set(outputWire, inputSignal);
}

function createCircuit(): Circuit {
    return INSTRUCTIONS.reduce<Circuit>((circuit, instruction) =>
        connectWire(circuit, instruction),
    new Map());
}

function traceSignal(circuit: Circuit, signal: string): number {
    const numericSignal = Number(signal);

    if (Number.isInteger((numericSignal))) {
        return numericSignal;
    }

    const signalInput = circuit.get(signal);

    if (signalInput === undefined) {
        return 0;
    }

    if (typeof signalInput === 'number') {
        return signalInput;
    }

    const numericSignalInput = Number(signalInput);

    if (Number.isInteger((numericSignalInput))) {
        circuit.set(signal, numericSignalInput);
        return numericSignalInput;
    }

    const gateResult = evaluateGate(circuit, signalInput);

    if (gateResult !== undefined) {
        circuit.set(signal, gateResult);
        return gateResult;
    }

    return traceSignal(circuit, signalInput);
}

function evaluateGate(circuit: Circuit, signal: string): number | undefined {
    const andGateMatch = signal.match(/^(?<signalA>\w+) AND (?<signalB>\w+)$/);
    if (andGateMatch?.groups) {
        const { signalA, signalB } = andGateMatch.groups;
        return traceSignal(circuit, signalA) & traceSignal(circuit, signalB);
    }

    const orGateMatch = signal.match(/^(?<signalA>\w+) OR (?<signalB>\w+)$/);
    if (orGateMatch?.groups) {
        const { signalA, signalB } = orGateMatch.groups;
        return traceSignal(circuit, signalA) | traceSignal(circuit, signalB);
    }

    const leftShiftGateMatch = signal.match(/^(?<signalA>\w+) LSHIFT (?<signalB>\w+)$/);
    if (leftShiftGateMatch?.groups) {
        const { signalA, signalB } = leftShiftGateMatch.groups;
        return traceSignal(circuit, signalA) << traceSignal(circuit, signalB);
    }

    const rightShiftGateMatch = signal.match(/^(?<signalA>\w+) RSHIFT (?<signalB>\w+)$/);
    if (rightShiftGateMatch?.groups) {
        const { signalA, signalB } = rightShiftGateMatch.groups;
        return traceSignal(circuit, signalA) >> traceSignal(circuit, signalB);
    }

    const notShiftGateMatch = signal.match(/^NOT (?<negatedSignal>\w+)$/);
    if (notShiftGateMatch?.groups) {
        const { negatedSignal } = notShiftGateMatch.groups;
        return ~traceSignal(circuit, negatedSignal);
    }

    return undefined;
}

export function partOne(): number {
    const circuit = createCircuit();
    return traceSignal(circuit, OUTPUT_WIRE);
}

export function partTwo(): number {
    const overriddenWire = 'b';
    const originalOutputSignal = partOne();

    const circuit = createCircuit();
    connectWire(circuit, originalOutputSignal + CONNECTION_SEPARATOR + overriddenWire);

    return traceSignal(circuit, OUTPUT_WIRE);
}

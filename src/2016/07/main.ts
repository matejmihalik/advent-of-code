// --- Day 7: Internet Protocol Version 7 ---
// https://adventofcode.com/2016/day/7

import { InputReader } from '#src/InputReader.ts';

const IPS = new InputReader(import.meta.url).readAsLines();

function doesIpSupportTls(ip: string): boolean {
    const hasAbbaInSupernetSequence =
        /(?<firstPairLetter>[a-z])(?!\k<firstPairLetter>)(?<secondPairLetter>[a-z])\k<secondPairLetter>\k<firstPairLetter>(?![a-z]*\])/.test(
            ip,
        );
    const hasAbbaInHypernetSequence =
        /\[[a-z]*(?<firstPairLetter>[a-z])(?!\k<firstPairLetter>)(?<secondPairLetter>[a-z])\k<secondPairLetter>\k<firstPairLetter>[a-z]*\]/.test(
            ip,
        );

    return hasAbbaInSupernetSequence && !hasAbbaInHypernetSequence;
}

export function partOne(): number {
    const tlsEnabledIps = IPS.filter(doesIpSupportTls);
    return tlsEnabledIps.length;
}

function doesIpSupportSsl(ip: string): boolean {
    const hasAbaBeforeBab =
        /(?<outsideLetter>[a-z])(?!\k<outsideLetter>)(?<insideLetter>[a-z])\k<outsideLetter>(?![a-z]*\]).*\[[a-z]*\k<insideLetter>\k<outsideLetter>\k<insideLetter>[a-z]*\]/.test(
            ip,
        );

    const hasBabBeforeAba =
        /\[[a-z]*(?<outsideLetter>[a-z])(?!\k<outsideLetter>)(?<insideLetter>[a-z])\k<outsideLetter>[a-z]*\].*\k<insideLetter>\k<outsideLetter>\k<insideLetter>(?![a-z]*\])/.test(
            ip,
        );

    return hasAbaBeforeBab || hasBabBeforeAba;
}

export function partTwo(): number {
    const sslEnabledIps = IPS.filter(doesIpSupportSsl);
    return sslEnabledIps.length;
}

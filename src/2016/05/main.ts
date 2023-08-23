// --- Day 5: How About a Nice Game of Chess? ---
// https://adventofcode.com/2016/day/5

import { createHash } from 'crypto';

import { InputReader } from '#src/InputReader.ts';

const DOOR_ID = new InputReader(import.meta.url).readAsString();

const PASSWORD_LENGTH = 8;
const INTERESTING_HASH_PREFIX = '00000';

function constructHash(salt: number): string {
    return createHash('md5')
        .update(DOOR_ID + salt)
        .digest('hex');
}

export function partOne(): string {
    const passwordCharacterIndex = 5;

    let password = '';
    let hashSalt = 0;

    while (password.length < PASSWORD_LENGTH) {
        const hash = constructHash(hashSalt);

        if (hash.startsWith(INTERESTING_HASH_PREFIX)) {
            password += hash.at(passwordCharacterIndex);
        }

        hashSalt++;
    }

    return password;
}

function isPasswordComplete(password: string[]): boolean {
    const filledCharacters = password.reduce((spaces) => spaces + 1, 0);
    return filledCharacters === password.length;
}

export function partTwo(): string {
    const passwordCharacterIndex = 6;
    const passwordCharacterPositionIndex = 5;

    const password = Array<string>(PASSWORD_LENGTH);
    let hashSalt = 0;

    while (!isPasswordComplete(password)) {
        const hash = constructHash(hashSalt);

        if (hash.startsWith(INTERESTING_HASH_PREFIX)) {
            const currentPasswordCharacter = hash.at(passwordCharacterIndex) ?? '';
            const currentPasswordCharacterPosition = Number(
                hash.at(passwordCharacterPositionIndex),
            );

            if (
                currentPasswordCharacterPosition >= 0 &&
                currentPasswordCharacterPosition < PASSWORD_LENGTH &&
                !password[currentPasswordCharacterPosition]
            ) {
                password[currentPasswordCharacterPosition] = currentPasswordCharacter;
            }
        }

        hashSalt++;
    }

    return password.join('');
}

export function sieveOfEratosthenes(limit: number): number[] {
    const numbers = Array<boolean>(limit + 1).fill(true);

    numbers[0] = false;
    numbers[1] = false;

    for (let number = 2; number <= Math.floor(Math.sqrt(limit)); number++) {
        if (!numbers[number]) {
            continue;
        }

        for (
            let numberMultiple = number ** 2;
            numberMultiple <= limit;
            numberMultiple += number
        ) {
            numbers[numberMultiple] = false;
        }
    }

    return numbers.reduce<number[]>((primes, isPrime, number) => {
        if (isPrime) {
            primes.push(number);
        }

        return primes;
    }, []);
}

export function divisorSum(number: number, primes: number[]): number {
    let sum = 1;
    let remainingNumber = number;

    for (
        let primeIterator = 0;
        primes[primeIterator] <= Math.sqrt(remainingNumber);
        primeIterator++
    ) {
        const currentPrime = primes[primeIterator];

        if (remainingNumber % currentPrime > 0) {
            continue;
        }

        let currentPrimeExponent = 1;

        while (remainingNumber % currentPrime === 0) {
            remainingNumber /= currentPrime;
            currentPrimeExponent++;
        }

        sum *= (currentPrime ** currentPrimeExponent - 1) / (currentPrime - 1);
    }

    if (remainingNumber > 1) {
        sum *= remainingNumber + 1;
    }

    return sum;
}

import { type Bucket, type Priority } from './BucketQueue';

const DEFAULT_PRIORITY = Infinity;

export class MinimumPriorityBucketQueue<T> {
    #buckets: Bucket<T>[] = [];
    #minimumPriority: Priority = DEFAULT_PRIORITY;

    pop(): T | undefined {
        const minimumPriorityBucket = this.#buckets[this.#minimumPriority];

        if (!minimumPriorityBucket) {
            return undefined;
        }

        const minimumPriorityItem = minimumPriorityBucket.pop();

        if (!minimumPriorityBucket.length) {
            delete this.#buckets[this.#minimumPriority];
            const minimumPriority = this.#buckets.findIndex((bucket) => bucket);
            this.#minimumPriority = minimumPriority === -1 ? DEFAULT_PRIORITY : minimumPriority;
        }

        return minimumPriorityItem;
    }

    push(item: T, priority: Priority): void {
        const itemBucket = (this.#buckets[priority] ??= []);
        itemBucket.push(item);

        this.#minimumPriority = Math.min(this.#minimumPriority, priority);
    }
}

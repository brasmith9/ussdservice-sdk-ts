import {IStorage} from "./IStorage";

export class InMemoryCache implements IStorage {
    private cache: Map<string, { value: string, expiration: number }>;

    constructor() {
        this.cache = new Map();
    }

    // Set cache with an optional TTL (in milliseconds)
    set(key: string, value: string, ttl: number = 10000): void {
        const expiration = Date.now() + ttl; // Set expiration time
        this.cache.set(key, { value, expiration });
    }

    // Get a value from the cache, checking if it's expired
    get(key: string): string | null {
        const cached = this.cache.get(key);

        if (!cached) {
            return null; // Return null if the key doesn't exist
        }

        // Check if the cache has expired
        if (cached.expiration < Date.now()) {
            this.cache.delete(key); // Remove expired entry
            return null;
        }

        return cached.value; // Return the cached value
    }

    // Delete a cache key manually
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    exists(key: string): boolean {
        return this.cache.has(key);
    }

    // Clear all expired cache entries (optional feature)
    clearExpired(): void {
        const now = Date.now();
        this.cache.forEach((value, key) => {
            if (value.expiration < now) {
                this.cache.delete(key); // Remove expired entries
            }
        });
    }
}
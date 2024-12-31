export interface IStorage {
    set(key: string, value: any, ttl?: number): void;
    get(key: string): any | null;
    delete(key: string): void;
    exists(key: string): boolean;
    clearExpired(): void;
}

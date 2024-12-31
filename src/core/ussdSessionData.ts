// Define the SessionData class
import {IStorage} from "../storage/IStorage";

export class UssdSessionData {
    private storage: IStorage;
    private readonly sessionDataKey: string;

    constructor(storage: IStorage) {
        this.storage = storage;
        this.sessionDataKey = "sessionData";
    }

    // Set method to store a value with the key
    async set(key: string, value: string): Promise<void> {
        this.storage.set(`${this.sessionDataKey}_${key}`, value);
    }

    // Get method to retrieve a value by the key
    async get(key: string): Promise<string | null> {
        return await this.storage.get(`${this.sessionDataKey}_${key}`);
    }

    // Exists method to check if a key exists
    async exists(key: string): Promise<boolean> {
        return this.storage.exists(`${this.sessionDataKey}_${key}`);
    }

    // Delete method to remove a key
    async delete(key: string): Promise<void> {
        this.storage.delete(`${this.sessionDataKey}_${key}`);
    }
}

/**
 * Represents response data for a ussd service.
 */
export class UssdServicesResponseData {
    display: string;
    value: string;
    readonly amount: number;

    /**
     * @param display The friendly name of an item in the collection
     * @param value The underlying value
     * @param amount The price tag (default is 0)
     */
    constructor(display: string, value: string, amount: number = 0) {
        this.display = display;
        this.value = value;
        this.amount = amount;
    }
}

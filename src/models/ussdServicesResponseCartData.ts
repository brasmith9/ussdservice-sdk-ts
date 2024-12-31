/**
 * Represents properties used to hold information about a cart that may be ready for checkout
 */
export class UssdServicesResponseCartData {
    itemName: string;
    qty: number;
    price: number;
    readonly itemId: string;
    serviceData: Record<string, string>;

    /**
     * @param itemName Friendly label to be displayed to the user
     * @param qty Must be valid and not null
     * @param price Must be valid and not null
     * @param itemId The ussd service Id. Optional, for backward compatibility with older services.
     *               Visit https://app-site.hubtel.com/products/services to retrieve your service ID.
     */
    constructor(itemName: string, qty: number, price: number, itemId: string = '') {
        this.itemName = itemName;
        this.qty = qty;
        this.price = price;
        this.itemId = itemId;
        this.serviceData = {};
    }
}

import { UssdServicesResponseCartData } from './ussdServicesResponseCartData';
import { UssdServicesResponseData } from './ussdServicesResponseData';

import constants from '../utils/constants/index';

const {UssdServiceActionTypes, UssdServiceDataTypes} = constants;

export class UssdServiceResponse {
    type: string;
    message: string;
    clientState: string;
    label: string;
    dataType: string;
    fieldType: string;
    fieldName: string | null;
    persistAsFavoriteStep: boolean;
    item: UssdServicesResponseCartData;
    data: UssdServicesResponseData[];

    // Internal fields (not exposed to users)
    private nextRoute?: string;
    private isRedirect: boolean = false;
    private exception?: Error;

    constructor() {
        this.type = '';
        this.message = '';
        this.clientState = '';
        this.label = '';
        this.dataType = '';
        this.fieldType = '';
        this.fieldName = '';
        this.persistAsFavoriteStep = false;
        this.item = new UssdServicesResponseCartData('', 0, 0);
        this.data = [];
    }

    get addToCart(): any | null {
        if (!this.item) return null;
        return {
            amount: this.item.price,
            description: this.item.itemName,
            itemId: this.item.itemId,
            serviceData: this.item.serviceData
        };
    }

    get isRelease(): boolean {
        return !this.nextRoute;
    }

    // Internal methods => NOT EXPOSED TO USERS
    setException(exception: Error): UssdServiceResponse {
        const response = new UssdServiceResponse();
        response.exception = exception;
        response.message = exception.message;
        response.label = exception.message;
        return response;
    }

    static addToCartForCheckout(
        message: string,
        data: UssdServicesResponseCartData,
        isUssd: boolean
    ): UssdServiceResponse {
        const response = new UssdServiceResponse();
        response.type = isUssd
            ? UssdServiceActionTypes.Release
            : UssdServiceActionTypes.AddToCart;
        response.message = message;
        response.item = data;
        response.dataType = UssdServiceDataTypes.display;
        return response;
    }

    static redirect(nextRoute: string): UssdServiceResponse {
        const response = new UssdServiceResponse();
        response.nextRoute = nextRoute;
        response.isRedirect = true;
        return response;
    }

    static render(
        message: string,
        dataItems: UssdServicesResponseData[] = [],
        cartItem: UssdServicesResponseCartData | null = null,
        label: string | null = null,
        dataType: string | null = null,
        fieldType: string = 'text',
        fieldName: string | null = '',
        persistAsFavoriteStep: boolean = false,
        nextRoute: string | null = null
    ): UssdServiceResponse {
        const response = new UssdServiceResponse();
        response.type = nextRoute
            ? UssdServiceActionTypes.Response
            : UssdServiceActionTypes.Release;
        response.message = message;
        response.nextRoute = nextRoute || undefined;
        response.data = dataItems;
        response.dataType = dataType || '';
        response.item = cartItem || new UssdServicesResponseCartData('', 0, 0);
        response.label = label || '';
        response.fieldType = fieldType;
        response.persistAsFavoriteStep = persistAsFavoriteStep;
        response.fieldName = fieldName;
        return response;
    }
}

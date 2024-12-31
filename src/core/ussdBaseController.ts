import {UssdServiceRequest} from "../models/ussdServiceRequest";
import {UssdSessionData} from "./ussdSessionData";
import {GenericHelpers} from "../utils/helpers/genericHelpers";
import {UssdServiceRoute} from "./ussdServiceRoute";
import {UssdServiceResponse} from "../models/ussdServiceResponse";
import {UssdServicesResponseCartData} from "../models/ussdServicesResponseCartData";
import {UssdServiceRequestHelpers} from "../utils/helpers/ussdServiceRequestHelpers";
import {UssdServicesResponseData} from "../models/ussdServicesResponseData";
import {Menu, MenuItem} from "../interactionElements/menu";
import {Form} from "../interactionElements/form";
import {PaginationOptions} from "./paginationOptions";
import {Input, InputOption} from "../interactionElements/input";

const {toJson, fromJson} = GenericHelpers;
const {isUssd} = UssdServiceRequestHelpers;

class UssdServiceControllerBase {
    private static readonly MenuProcessorDataKey = "MenuProcessorData";
    private static readonly FormProcessorDataKey = "FormProcessorData";
    private static readonly FormDataKey = "FormData";

    private static readonly PaginationOptionsKey = "__paginationOptions__";
    private static readonly PaginationCollectionKey = "__paginationCollection__";
    private static readonly OnPaginationItemSelectedName = "__onPaginationItemSelectedName__";
    private static readonly OnPaginationItemSelectedValue = "__onPaginationItemSelectedValue__";

    request: UssdServiceRequest;
    dataBag: UssdSessionData;
    data: Record<string, string>;
    formData: Record<string, string>;

    constructor(request: UssdServiceRequest, dataBag: UssdSessionData) {
        this.request = request;
        this.dataBag = dataBag;
        this.data = {};
        this.formData = {};
    }

    // Get Form's response data
    async getFormData(): Promise<{ [key: string]: string }> {
        const json = await this.dataBag.get(UssdServiceControllerBase.FormDataKey);
        try {
            const data = JSON.parse(typeof json === "string" ? json : "{}");
            return data;
        } catch (ex) {
            return {};
        }
    }

    redirect(action: string, controller: string | null = ''): UssdServiceResponse {
        return UssdServiceResponse.redirect(this.route(action, controller));
    }

    // Prepare response for adding item to cart
    addToCart(message: string, cartData: UssdServicesResponseCartData): UssdServiceResponse {
        if (!cartData) {
            throw new Error('cartData cannot be null');
        }
        return UssdServiceResponse.addToCartForCheckout(message, cartData, isUssd(this.request));
    }

    // Render message for USSD or rich clients
    render(
        message: string,
        dataItems: UssdServicesResponseData[] = [],
        cartData: UssdServicesResponseCartData | null = null,
        label: string | null = null,
        dataType: string | null = null,
        fieldType: string = 'text',
        fieldName: string | null = '',
        persistAsFavoriteStep: boolean = false,
        action: string | null = null,
        controller: string | null = null
    ): UssdServiceResponse {
        if (!message) {
            message = '';
        }

        let route = '';
        if (action) {
            route = this.route(action, controller);
        }

        return UssdServiceResponse.render(
            message, dataItems, cartData, label, dataType, fieldType, fieldName, persistAsFavoriteStep, route
        );
    }

    // Render USSD menu
    async renderMenu(
        ussdMenu: Menu,
        dataItems: UssdServicesResponseData[] = [],
        cartItem: UssdServicesResponseCartData | null = null,
        label: string | null = null,
        dataType: string | null = null,
        persistAsFavoriteStep: boolean = false
    ): Promise<UssdServiceResponse> {
        const json = JSON.stringify(ussdMenu);
        await this.dataBag.set(UssdServiceControllerBase.MenuProcessorDataKey, json);
        return this.render(ussdMenu.render(), dataItems, cartItem, label, dataType, '', '', persistAsFavoriteStep, 'MenuProcessor');
    }

    // Process menu selection
    async menuProcessor(): Promise<UssdServiceResponse> {
        const json = await this.dataBag.get(UssdServiceControllerBase.MenuProcessorDataKey);
        const menu = JSON.parse(typeof json === "string" ? json : "{}");
        let item: MenuItem;

        try {
            const choice = parseInt(this.request.trimmedMessage);
            if (choice === 0 && menu.zeroItem != null) {
                return this.redirect(menu.zeroItem.action, menu.zeroItem.controller);
            }

            item = menu.items[choice - 1];
        } catch (ex) {
            return this.render(`Menu choice ${this.request.trimmedMessage} does not exist.`);
        }

        await this.dataBag.delete(UssdServiceControllerBase.MenuProcessorDataKey);
        return this.redirect(item.action, item.controller);
    }

    // Render a form (series of inputs)
    async renderForm(
        form: Form,
        dataItems: UssdServicesResponseData[] = [],
        cartItem: UssdServicesResponseCartData | null = null,
        label: string | null = null,
        dataType: string | null = null,
        fieldType: string = 'text',
        fieldName: string = '',
        persistAsFavoriteStep: boolean = false
    ): Promise<UssdServiceResponse> {
        const json = JSON.stringify(form);
        await this.dataBag.set(UssdServiceControllerBase.FormProcessorDataKey, json);
        return this.richFormInputDisplay(dataItems, cartItem, label, dataType, fieldType, fieldName, persistAsFavoriteStep);
    }

    // Process form inputs
    async formInputProcessor(): Promise<UssdServiceResponse> {
        const form = await this.getForm();
        const input = form.inputs[form.processingPosition];
        const key = input.name;
        let value: string | null = null;

        if (!input.hasOptions) {
            value = this.request.trimmedMessage;
        } else {
            try {
                const requestValue = this.request.trimmedMessage;
                let inputOption = input.options.find(i => i.index === requestValue);

                if (!inputOption) {
                    const choice = parseInt(requestValue);
                    inputOption = input.options[choice - 1];
                }

                value = inputOption?.value;
            } catch (ex) {
                return this.render(`Option ${this.request.trimmedMessage} does not exist.`);
            }
        }

        form.data[key] = value;

        if (form.processingPosition === form.inputs.length - 1) {
            await this.dataBag.delete(UssdServiceControllerBase.FormProcessorDataKey);
            const jsonData = JSON.stringify(form.data);
            await this.dataBag.set(UssdServiceControllerBase.FormDataKey, jsonData);
            return this.redirect(form.action, form.controller);
        }

        form.processingPosition++;
        const json = JSON.stringify(form);
        await this.dataBag.set(UssdServiceControllerBase.FormProcessorDataKey, json);
        return this.redirect('FormInputDisplay');
    }

    async formInputDisplay(): Promise<UssdServiceResponse> {
        const form = await this.getForm();
        const input = form.inputs[form.processingPosition];
        const displayName = input.displayName || input.name;
        let message = '';

        if (form.title) {
            message += form.title + '\n';
        }

        message += `${displayName}\n`;

        input.options.forEach((option, i) => {
            const value = option.displayValue || option.value;
            message += `${i + 1}. ${value}\n`;
        });

        return this.render(message, [], null, null, null, 'text', null, false, 'FormInputProcessor');
    }

    // USSD Pagination
    async paginateForUssd(collection: { [key: string]: string }, paginationOptions: PaginationOptions): Promise<(form: Form, dataItems?: UssdServicesResponseData[], cartItem?: (UssdServicesResponseCartData | null), label?: (string | null), dataType?: (string | null), fieldType?: string, fieldName?: string, persistAsFavoriteStep?: boolean) => Promise<UssdServiceResponse>> {
        if (!collection || !paginationOptions) {
            throw new Error('Invalid parameters');
        }

        if (paginationOptions.nextPageKey === paginationOptions.previousPageKey) {
            throw new Error('Next page key cannot be the same as the previous page key');
        }

        if (!this.formData) {
            this.formData = {};
        }

        if (!isUssd(this.request)) {
            throw new Error('This method is meant for USSD context only');
        }

        await this.dataBag.set('__paginationOptions__', JSON.stringify(paginationOptions));
        await this.dataBag.set('__paginationCollection__', JSON.stringify(collection));
        await this.dataBag.set('__onPaginationItemSelectedName__', '__onPaginationItemSelectedValue__');

        const form = (await this.paginateCollection(collection, paginationOptions))[0];
        form.data = this.formData;

        return this.renderForm

    }

    route(action: string, controller: string | null = ''):
        string {
        if (!controller) {
            controller = this.constructor.name;
        }

        return toJson(new UssdServiceRoute(action, controller));
    }

    async paginateCollection(collection: Record<string, string>, paginationOptions: PaginationOptions): Promise<Form[]> {
        return await Promise.all([]);
    }


    async richFormInputDisplay(dataItems: UssdServicesResponseData[] = [], cartItem: UssdServicesResponseCartData | null = null, label: string | null = null, dataType: string | null = null, fieldType: string = 'text', fieldName: string = '', persistAsFavoriteStep: boolean = false): Promise<UssdServiceResponse> {
        const form = await this.getForm();
        const input = form.inputs[form.processingPosition];
        const displayName = input.displayName || input.name;
        let message = '';

        if (form.title
        ) {
            message += form.title + '\n';
        }

        if (!input.hasOptions) {
            message += `${displayName}\n`;
        } else {
            message += `${displayName}\n`;

            input.options.forEach((option, i) => {
                const value = option.displayValue || option.value;
                message += `${i + 1}. ${value}\n`;
            });
        }

        return this.render(message, dataItems, cartItem, label, dataType, fieldType, fieldName, persistAsFavoriteStep, 'FormInputProcessor');
    }

    async getForm(): Promise<Form> {
        const json = await this.dataBag.get(UssdServiceControllerBase.FormProcessorDataKey);
        return JSON.parse(typeof json === "string" ? json : "{}");
    }
}

import {UssdServiceActionTypes} from "../constants/ussdServiceActionTypes";
import {UssdServiceResponse} from "../../models/ussdServiceResponse";

/**
 * Attempts to determine the action type from Hubtel.
 */
export class UssdServiceResponseExtensions {
    /**
     * Gets the action type based on the provided response type.
     * @param request The UssdServiceResponse object.
     * @returns The corresponding UssdServiceActionType.
     */
    static getActionType(request: UssdServiceResponse): string {
        if (!request.type) {
            return UssdServiceActionTypes.Unknown;
        }

        switch (request.type.toLowerCase()) {
            case 'initiation':
                return UssdServiceActionTypes.Initiation;
            case 'response':
                return UssdServiceActionTypes.Response;
            case 'release':
                return UssdServiceActionTypes.Release;
            case 'timeout':
                return UssdServiceActionTypes.Timeout;
            default:
                return UssdServiceActionTypes.Unknown;
        }
    }
}
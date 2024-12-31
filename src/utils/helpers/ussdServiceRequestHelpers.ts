import {UssdServiceRequest} from '../../models/ussdServiceRequest';
import constants from '../constants/index';

const {UssdServiceActionTypes} = constants;

export class UssdServiceRequestHelpers {
    static getActionType(request: UssdServiceRequest): string {
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
            case 'query':
                return UssdServiceActionTypes.Query;
            case 'favorite':
                return UssdServiceActionTypes.Favorite;
            default:
                return UssdServiceActionTypes.Unknown;
        }
    }

    // IsUssd Method
    static isUssd(request: UssdServiceRequest): boolean {
        if (request.platform?.toLowerCase() === 'ussd') {
            return true;
        }

        const ussdOperators = [
            'glo', 'glo-gh', 'mtn', 'mtn-gh', 'tigo', 'tigo-gh',
            'airtel', 'airtel-gh', 'vodafone', 'vodafone-gh',
            'airteltigo', 'airteltigo-gh', 'safaricom', 'safaricom-ke'
        ];

        return ussdOperators.includes(request.operator?.toLowerCase() || '');
    }
}

export class UssdServiceRequest {
    sessionId: string;
    serviceCode: string;
    type: string;
    message: string;
    operator: string;
    platform: string;
    mobile: string;
    clientState: string | null;
    sequence: number | null;
    extraData: Record<string, any> | null;

    constructor(sessionId: string, serviceCode: string, type: string, message: string, operator: string, platform: string, mobile: string, sequence: number) {
        this.extraData = {};
        this.sessionId = sessionId
        this.serviceCode = serviceCode
        this.type = type
        this.message = message
        this.operator = operator
        this.platform = platform
        this.mobile = mobile
        this.clientState = null
        this.sequence = sequence
    }

    get trimmedMessage(): string {
        return this.message.trim();
    }
}

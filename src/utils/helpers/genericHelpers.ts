import {UssdServiceRoute} from "../../core/ussdServiceRoute";

export class GenericHelpers{
    static toJson(json: any): string {
        return JSON.stringify(json);
    }

     static fromJson(jsonString: string | null): UssdServiceRoute {
        return JSON.parse(typeof jsonString === "string" ? jsonString : "{}");
    }
}
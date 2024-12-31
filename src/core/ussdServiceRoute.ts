export class UssdServiceRoute {
    private static readonly ControllerSuffix = "Controller";
    public controllerName: string;
    public actionName: string;

    constructor(controllerName: string, actionName: string) {
        this.controllerName = controllerName;
        this.actionName = actionName;
    }

    public get fullControllerName(): string {
        return this.controllerName.endsWith(UssdServiceRoute.ControllerSuffix)
            ? this.controllerName
            : `${this.controllerName}${UssdServiceRoute.ControllerSuffix}`;
    }
}

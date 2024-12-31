/**
 * Represents an input field in a form.
 */
export class Input {
    name: string;
    displayName: string | null;
    options: InputOption[];

    // Whether the input has options (used for select inputs, etc.)
    get hasOptions(): boolean {
        return !(this.options == null || this.options.length === 0);
    }

    constructor() {
        this.name = '';
        this.displayName = null;
        this.options = [];
    }

    /**
     * Creates a new input instance.
     * @param name The name of the input
     * @param displayName Optional display name for the input
     * @returns The new input instance
     */
    static New(name: string, displayName: string | null = null): Input {
        const input = new Input();
        input.name = name;
        input.displayName = displayName;
        return input;
    }

    /**
     * Adds a possible input option to the input.
     * Makes the input a selection-based input (e.g., dropdown).
     * @param value The value for the option
     * @param displayValue The display value for the option
     * @returns The current input instance (for chaining)
     */
    option(value: string, displayValue: string | null = null): Input {
        this.options.push(InputOption.New(value, displayValue));
        return this;
    }
}

/**
 * Represents an option for a selection-based input field.
 */
export class InputOption {
    value: string;
    displayValue: string | null;
    index: string | null;
    controller: string | null;
    action: string | null;

    constructor() {
        this.value = '';
        this.displayValue = null;
        this.index = null;
        this.controller = null;
        this.action = null;
    }

    /**
     * Creates a new InputOption instance.
     * @param value The value of the option
     * @param displayValue Optional display value for the option
     * @param index Optional index for the option
     * @param controller Optional controller for the option
     * @param action Optional action for the option
     * @returns The new InputOption instance
     */
    static New(value: string, displayValue: string | null = null,
               index: string | null = null, controller: string | null = null,
               action: string | null = null): InputOption {
        const option = new InputOption();
        option.value = value;
        option.displayValue = displayValue;
        option.index = index;
        option.controller = controller;
        option.action = action;
        return option;
    }
}

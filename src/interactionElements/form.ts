import {Input} from "./input";

/**
 * Setup a new form to collect a series of inputs.
 */
export class Form {
    title: string;
    inputs: Input[];
    processingPosition: number;
    data: Record<string, string>;
    controller: string;
    action: string;

    /**
     * Constructor to initialize the form with default or specified values.
     * @param title Title of the form
     * @param action Action endpoint for the form
     * @param controller Controller handling the form
     */
    private constructor(title: string | null = null, action: string | null = null, controller: string | null = null) {
        this.title = title || '';
        this.inputs = [];
        this.action = action || '';
        this.controller = controller || '';
        this.processingPosition = 0;
        this.data = {};
    }

    /**
     * Creates a new instance of Form.
     * @param title Title of the form
     * @param action Action endpoint
     * @param controller Optional controller for the form
     * @returns New Form instance
     */
    static New(title: string, action: string, controller: string | null = null): Form {
        return new Form(title, action, controller);
    }

    /**
     * Add input field to form.
     * @param input Input field to add
     * @returns The current form instance (for chaining)
     */
    addInput(input: Input): Form {
        this.inputs.push(input);
        return this;
    }
}

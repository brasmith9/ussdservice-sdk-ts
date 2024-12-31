/**
 * Represents a menu to redirect to an appropriate choice.
 */
export class Menu {
    header: string | null;
    footer: string | null;
    items: MenuItem[];
    zeroItem: MenuItem | null;

    constructor() {
        this.header = null;
        this.footer = null;
        this.items = [];
        this.zeroItem = null;
    }

    /**
     * Create a new menu.
     * @param header Displayed before menu items.
     * @param footer Displayed after menu items.
     * @returns The new Menu instance.
     */
    static New(header: string | null = null, footer: string | null = null): Menu {
        const menu = new Menu();
        menu.header = header;
        menu.footer = footer;
        return menu;
    }

    /**
     * Add an item to the menu.
     * @param display The display text for the menu item.
     * @param action The action to be taken for the menu item.
     * @param controller Optional controller for the item.
     * @returns The current Menu instance (for chaining).
     */
    addItem(display: string, action: string, controller: string | null = null): Menu {
        this.items.push(new MenuItem(display, action, controller));
        return this;
    }

    /**
     * Add an item to be rendered as the last 0 option on the menu.
     * @param display The display text for the 0 item.
     * @param action The action to be taken for the 0 item.
     * @param controller Optional controller for the item.
     * @returns The current Menu instance (for chaining).
     */
    addZeroItem(display: string, action: string, controller: string | null = null): Menu {
        this.zeroItem = new MenuItem(display, action, controller);
        return this;
    }

    /**
     * Render the menu to be displayed.
     * @returns The rendered menu as a string.
     */
    render(): string {
        let display = '';
        if (this.header) {
            display += this.header + '\n';
        }
        this.items.forEach((item, index) => {
            display += `${index + 1}. ${item.display}\n`;
        });
        if (this.zeroItem) {
            display += `0. ${this.zeroItem.display}\n`;
        }
        if (this.footer) {
            display += this.footer;
        }
        return display;
    }
}

/**
 * Represents a menu item in the menu.
 */
export class MenuItem {
    display: string;
    action: string;
    controller: string | null;

    constructor(display: string, action: string, controller: string | null = null) {
        this.display = display;
        this.action = action;
        this.controller = controller;
    }
}

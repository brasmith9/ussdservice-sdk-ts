
export class PaginationOptions {
    public title: string = "Select";
    public pageCount: number = 3;
    public nextPageKey: string = "9";
    public nextPageDisplayText: string = "More";
    public previousPageKey: string = "8";
    public previousPageDisplayText: string = "Back";
    public useDefaultNumberListing: boolean = true;
}

class PaginationElement {
    public key: string;
    public display: string;
    public numberingIndex: string;

    constructor(key: string, display: string, numberingIndex: string) {
        this.key = key;
        this.display = display;
        this.numberingIndex = numberingIndex;
    }
}
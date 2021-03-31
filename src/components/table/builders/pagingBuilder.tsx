import { IEntity, ITableBuilder } from "./tableBuilder";

export interface IPagingBuilder<T extends IEntity> {
    PageSizeOption: (size: number) => IPagingBuilder<T>
    PageSizeAll: () => IPagingBuilder<T>
    Dynamic: () => IPagingBuilder<T>
    End: () => ITableBuilder<T>;
}

export type PagingConfiguration = {
    pagingOptions: (number | {label: string, value: (data: any[]) => number })[]
    dynamic: boolean
}

export class PagingBuilder<T extends IEntity> implements IPagingBuilder<T> {

    tableBuilder: ITableBuilder<T>;
    completionHandler: () => void;
    pagingOptions: (number | {label: string, value: (data: any[]) => number})[] = []
    dynamic: boolean = false;

    constructor(tableBuilder: ITableBuilder<T>, completionHandler: () => void) {
        this.tableBuilder = tableBuilder;
        this.completionHandler = completionHandler;
    }

    End = () : ITableBuilder<T> => {
        this.completionHandler();
        return this.tableBuilder;
    }

    PageSizeAll = () : IPagingBuilder<T> => {
        this.pagingOptions.push({label: "All", value: (data) => data.length})
        return this;
    }

    PageSizeOption = (size: number) : IPagingBuilder<T> => {
        if(this.pagingOptions.includes(size)) return this;
        this.pagingOptions.push(size);
        return this;
    }

    Dynamic = () : IPagingBuilder<T> => {
        this.dynamic = true;
        return this;
    }

    Build = () : PagingConfiguration => {

        if(this.dynamic) {
            for(let i = 0; i < this.pagingOptions.length; i++) {
                if(typeof this.pagingOptions[i] !== "number") {
                    throw new Error("Page size option \"all\" is invalid for dynamic paging content")
                }
            }
        }

        return {
            pagingOptions: this.pagingOptions,
            dynamic: this.dynamic
        }
    }
}
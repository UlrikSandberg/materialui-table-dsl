import TextHeader from "../metamodel/columns/headers/TextHeader";
import { IEntity, ITableBuilder } from "./tableBuilder";

export interface IToolbarBuilder<T extends IEntity> {
    SupportFullTableSearch: () => IToolbarBuilder<T>
    SupportCSVExport: () => IToolbarBuilder<T>
    SupportPrintExport: () => IToolbarBuilder<T>
    SupportColumnToggles: () => IToolbarBuilder<T>
    SupportColumnFiltering: () => IToolbarBuilder<T>
    End: () => ITableBuilder<T>
}

export type ToolbarConfiguration = {
    supportFullTableSearch?: boolean
    supportCSVExport?: boolean
    supportPrintExport?: boolean
    supportColumnFiltering?: boolean
    supportColumnToggles?: boolean
    tableName: string
}

export class ToolbarBuilder<T extends IEntity> {

    tableBuilder: ITableBuilder<T>
    completionHandler: () => void

    tableName: string
    supportFullTableSearch?: boolean
    supportCSVExport?: boolean
    supportPrintExport?: boolean
    supportColumnFiltering?: boolean
    supportColumnToggles?: boolean

    constructor(tableBuilder: ITableBuilder<T>, completionHandler: () => void, tableName: string) {
        this.tableBuilder = tableBuilder;
        this.completionHandler = completionHandler;
        this.tableName = tableName;
    }

    End = () : ITableBuilder<T> => {
        this.completionHandler();
        return this.tableBuilder;
    }

    SupportFullTableSearch = () : IToolbarBuilder<T> => {
        this.supportFullTableSearch = true;
        return this;
    }

    SupportPrintExport = () : IToolbarBuilder<T> => {
        this.supportPrintExport = true;
        return this;
    }

    SupportCSVExport = () : IToolbarBuilder<T> => {
        this.supportCSVExport = true;
        return this;
    }

    SupportColumnFiltering = () : IToolbarBuilder<T> => {
        this.supportColumnFiltering = true;
        return this;
    }

    SupportColumnToggles = () : IToolbarBuilder<T> => {
        this.supportColumnToggles = true;
        return this;
    }

    Build = () : ToolbarConfiguration => {
        return {
            supportFullTableSearch: this.supportFullTableSearch,
            tableName: this.tableName,
            supportCSVExport: this.supportCSVExport,
            supportPrintExport: this.supportPrintExport,
            supportColumnFiltering: this.supportColumnFiltering,
            supportColumnToggles: this.supportColumnToggles
        }
    }
}
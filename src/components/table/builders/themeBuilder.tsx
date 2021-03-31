import React from "react";
import { IEntity, ITableBuilder } from "./tableBuilder";

export interface IThemeBuilder<T extends IEntity> {
    SizeBreakpoint: (name: string, screenSize: number) => IThemeBuilder<T>
    End:() => ITableBuilder<T>
}

export type ThemeConfiguration = {
    themeSymbolTable: Map<string, any>;
}

export class ThemeBuilder<T extends IEntity> implements IThemeBuilder<T> {

    tableBuilder: ITableBuilder<T>;
    completionHandler: () => void;

    themeSymbolTable: Map<string, any> = new Map();

    constructor(tableBuilder: ITableBuilder<T>, completionHandler: () => void) {
        this.tableBuilder = tableBuilder;
        this.completionHandler = completionHandler;
    }

    SizeBreakpoint = (name: string, screenSize: number) : IThemeBuilder<T> => {
        this.themeSymbolTable.set(name, screenSize);
        return this;
    }

    End = () : ITableBuilder<T> => {
        this.completionHandler();
        return this.tableBuilder;
    }

    Build = () : ThemeConfiguration => {
        return {
            themeSymbolTable: this.themeSymbolTable
        }
    }
}
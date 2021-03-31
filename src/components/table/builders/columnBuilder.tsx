import React, { ReactNode } from "react";
import EmptyHeader from "../metamodel/columns/headers/EmptyHeader";
import TextHeader from "../metamodel/columns/headers/TextHeader";
import { IEntity, ITableBuilder } from "./tableBuilder";
import { v4 as uuid } from "uuid";
import SelectableColumn from "../metamodel/columns/SelectableColumn";
import SelectableHeader, { SelectableHeaderProps } from "../metamodel/columns/headers/SelectableHeader";
import TextColumn from "../metamodel/columns/TextColumn";
import CustomColumn from "../metamodel/columns/CustomColumn";
import CollapsableColumn from "../metamodel/columns/CollapsableColumn";

export interface IColumnBuilder<T extends IEntity>{
    Sortable: () => IColumnBuilder<T>;
    Collapseable: (collapseableViewRenderer: (data: T) => ReactNode) => IColumnBuilder<T>;
    Label: (label: string) => IColumnBuilder<T>;
    Field: (getterKey: keyof T) => IColumnBuilder<T>
    HideOnBreakpoint: (breakPointId: string) => IColumnBuilder<T>
    Authorize: (roles: string | string[]) => IColumnBuilder<T>
    Numeric: () => IColumnBuilder<T>
    Column: (label?: string, numeric?: boolean) => IColumnBuilder<T>
    OnClick: (handler: (data: T) => void) => IColumnBuilder<T>;
    End: () => ITableBuilder<T>;
    Custom: (customRenderer: (data: T) => ReactNode) => IColumnBuilder<T>
}

export enum ColumnHeaderType {
    Selectable,
    Empty,
    Text
}

export interface ColumnHeaderConfiguration {
    columnHeaderType: ColumnHeaderType
    label?: string
    component: React.FunctionComponent<any>
    sortable?: boolean
    id: string
    numeric?: boolean
    fieldGetter?: keyof any,
    breakpointRule?: number,
    authorizedRoles?: string[]
}

export enum ColumnType {
    Selectable,
    Collapsable,
    Text,
    Custom
}

export interface ColumnConfiguration {
    component: React.FunctionComponent<any>,
    columnType: ColumnType
    fieldGetter?: keyof any
    breakpointRule?: number,
    authorizedRoles?: string[],
    onClick?: (data: any) => void;
    customRenderer?: (data: any) => ReactNode;
    collapseableViewRenderer?: (data: any) => ReactNode;
}

export class ColumnBuilder<T extends IEntity> implements IColumnBuilder<T> {

    tableBuilder: ITableBuilder<T>;
    label?: string;
    sortable: boolean = false;
    fieldGetter?: keyof T;
    completionHandler: () => void;
    numeric?: boolean;
    breakPointsId?: string
    authorizedRoles: string[] = [];
    onClick?: (data: T) => void
    customRenderer?: (data: any) => ReactNode;
    collapseableViewRenderer?: (data: any) => ReactNode;

    constructor(tableBuilder: ITableBuilder<T>, completionHandler: () => void, label?: string, numeric?: boolean) {
        this.tableBuilder = tableBuilder;
        this.label = label;
        this.numeric = numeric;
        this.completionHandler = completionHandler;
    }

    Column = (label?: string, numeric?: boolean) : IColumnBuilder<T> => {
        return this.tableBuilder.Column(label, numeric);
    }

    OnClick = (handler: (data: T) => void) : IColumnBuilder<T> => {
        this.onClick = handler;
        return this;
    }

    HideOnBreakpoint = (breakPointId: string) : IColumnBuilder<T> => {
        this.breakPointsId = breakPointId;
        return this;
    }

    Collapseable = (collapseableViewRenderer: (data: T) => ReactNode) : IColumnBuilder<T> => {
        this.collapseableViewRenderer = collapseableViewRenderer;
        return this;
    }

    Custom = (customRenderer: (data: T) => ReactNode) : IColumnBuilder<T> => {
        if(this.fieldGetter) {
            throw new Error("A column can't both specify a custom renderer and generic field getter")
        }
        this.customRenderer = customRenderer;
        return this;
    }

    Authorize = (roles: string | string[]) : IColumnBuilder<T> => {
        if(typeof roles === "string") {
            this.authorizedRoles.push(roles)
        } else {
            for(let i = 0; i < roles.length; i++) {
                this.authorizedRoles.push(roles[i]);
            }
        }

        return this;
    }

    Sortable = () : IColumnBuilder<T> => {
        this.sortable = true;
        return this;
    }

    Field = (fieldGetter: keyof T) : IColumnBuilder<T> => {
        if(this.customRenderer) {
            throw new Error("A column can't both specify a custom renderer and generic field getter")
        }
        this.fieldGetter = fieldGetter;
        return this;
    }

    Numeric = () : IColumnBuilder<T> => {
        this.numeric = true;
        return this;
    }

    Label = (label: string) : IColumnBuilder<T> => {
        this.label = label;
        return this;
    }

    End = () : ITableBuilder<T> => {
        this.completionHandler();
        return this.tableBuilder;
    }

    BuildHeaderConfig = (themeSymbolTable?: Map<string, any>, authorizationSymbolTable?: Map<string, any>) : ColumnHeaderConfiguration => {
        
        if(this.sortable && this.label === undefined) {
            throw new Error("A sortable column must have a header")
        }

        if(this.sortable && this.fieldGetter === undefined) {
            throw new Error("A sortable column must have a fieldGetter");
        }

        // Check breakpoint validity
        let breakPointRule : number | undefined;
        if(this.breakPointsId) {
            if(themeSymbolTable === undefined) {
                throw new Error(`Theme breakpoint: \"${this.breakPointsId}\" couldn't be resolved, no ThemeConfiguration specified`)
            }
            // If the symbol table exists, resolve the themeBreakpoint
            const value = themeSymbolTable.get(this.breakPointsId)
            if(typeof value !== "number") {
                throw new Error(`Theme breakpoint: \"${this.breakPointsId}\" couldn't be resolved, breakpoint not found in specified ThemeConfiguration`)
            }
            breakPointRule = value as number;
        }

        // We have assigned required authorized roles to this column
        let authorizedRoles : string[] | undefined;
        if(this.authorizedRoles.length > 0) {
            if(authorizationSymbolTable === undefined) {
                throw new Error(`Column: ${this.label} could not resolve authorized roles: ${this.authorizedRoles.join(", ")} - No AuthorizationConfiguration specified`)
            }
            for(let i = 0; i < this.authorizedRoles.length; i++) {
                const value = authorizationSymbolTable.get(this.authorizedRoles[i])
                if(typeof value !== "string") {
                    throw new Error(`Column: ${this.label} could not resolve authorized role: ${this.authorizedRoles[i]} - role not found in specified AuthorizationConfiguration`)
                }
            }
            authorizedRoles = this.authorizedRoles;
        }

        const headerType = this.label ? ColumnHeaderType.Text : ColumnHeaderType.Empty;
        const label = this.label;
        const component = this.label ? TextHeader : EmptyHeader;

        return {
            columnHeaderType: headerType,
            label: label,
            component: component,
            sortable: this.sortable,
            id: uuid(),
            numeric: this.numeric,
            fieldGetter: this.fieldGetter,
            breakpointRule: breakPointRule,
            authorizedRoles: authorizedRoles
        }
    }

    BuildConfig = (themeSymbolTable?: Map<string, any>, authorizationSymbolTable?: Map<string, any>) : ColumnConfiguration => {
        
        let breakPointRule : number | undefined;
        if(this.breakPointsId) {
            if(themeSymbolTable === undefined) {
                throw new Error(`Theme breakpoint: \"${this.breakPointsId}\" couldn't be resolved, no ThemeConfiguration specified`)
            }
            // If the symbol table exists, resolve the themeBreakpoint
            const value = themeSymbolTable.get(this.breakPointsId)
            if(typeof value !== "number") {
                throw new Error(`Theme breakpoint: \"${this.breakPointsId}\" couldn't be resolved, breakpoint not found in specified ThemeConfiguration`)
            }
            breakPointRule = value as number;
        }

        // We have assigned required authorized roles to this column
        let authorizedRoles : string[] | undefined;
        if(this.authorizedRoles.length > 0) {
            if(authorizationSymbolTable === undefined) {
                throw new Error(`Column: ${this.label} could not resolve authorized roles: ${this.authorizedRoles.join(", ")} - No AuthorizationConfiguration specified`)
            }
            for(let i = 0; i < this.authorizedRoles.length; i++) {
                const value = authorizationSymbolTable.get(this.authorizedRoles[i])
                if(typeof value !== "string") {
                    throw new Error(`Column: ${this.label} could not resolve authorized role: ${this.authorizedRoles[i]} - role not found in specified AuthorizationConfiguration`)
                }
            }
            authorizedRoles = this.authorizedRoles;
        }
        
        if(this.fieldGetter) {
            return {
                component: TextColumn,
                columnType: ColumnType.Text,
                fieldGetter: this.fieldGetter,
                breakpointRule: breakPointRule,
                authorizedRoles: authorizedRoles,
                onClick: this.onClick
            }
        }

        if(this.customRenderer) {
            return {
                component: CustomColumn,
                columnType: ColumnType.Custom,
                breakpointRule: breakPointRule,
                authorizedRoles: authorizedRoles,
                customRenderer: this.customRenderer
            }
        }

        if(this.collapseableViewRenderer) {
            return {
                component: CollapsableColumn,
                columnType: ColumnType.Collapsable,
                breakpointRule: breakPointRule,
                authorizedRoles: authorizedRoles,
                collapseableViewRenderer: this.collapseableViewRenderer
            }
        }

        return {
            component: TextColumn,
            columnType: ColumnType.Collapsable,
            fieldGetter: "id",
        }
    }
    

    BuildSelectableHeaderConfig = () : ColumnHeaderConfiguration => {
        return {
            columnHeaderType: ColumnHeaderType.Selectable,
            component: SelectableHeader,
            id: uuid(),

        };
    }

    BuildSelectableColumnConfig = () : ColumnConfiguration => {
        return {
            columnType: ColumnType.Selectable,
            component: SelectableColumn,
            fieldGetter: ""
        }
    }
}
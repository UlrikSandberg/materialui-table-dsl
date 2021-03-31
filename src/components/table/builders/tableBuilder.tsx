import React, { ReactComponentElement, ReactNode } from "react";
import EmptyHeader from "../metamodel/columns/headers/EmptyHeader";
import SelectableHeader, { SelectableHeaderProps } from "../metamodel/columns/headers/SelectableHeader";
import TextHeader from "../metamodel/columns/headers/TextHeader";
import SelectableColumn from "../metamodel/columns/SelectableColumn";
import MetaTable from "../metamodel/MetaTable";
import { ColumnBuilder, ColumnConfiguration, ColumnHeaderConfiguration, ColumnHeaderType, IColumnBuilder } from "./columnBuilder";
import {v4 as uuid} from "uuid"
import { IPagingBuilder, PagingBuilder, PagingConfiguration } from "./pagingBuilder";
import { IThemeBuilder, ThemeBuilder, ThemeConfiguration } from "./themeBuilder";
import { AuthorizationBuilder, AuthorizationConfiguration, IAuthorizationBuilder } from "./authorizationBuilder";
import { IToolbarBuilder, ToolbarBuilder, ToolbarConfiguration } from "./toolbarBuilder";

export interface ITableBuilder<T extends IEntity> {
    Column: (label?: string, numeric?: boolean) => IColumnBuilder<T>
    DefaultSort: (field: keyof T) => ITableBuilder<T>
    CurrentAccessRole: (accessRole: string) => ITableBuilder<T>
    Paging: () => IPagingBuilder<T>
    Theme: () => IThemeBuilder<T>
    Authorization: () => IAuthorizationBuilder<T>
    Caption: (caption: string) => ITableBuilder<T>
    Selectable: (customComponent?: React.FunctionComponent<SelectableHeaderProps>) => ITableBuilder<T>;
    Toolbar: (tableName: string) => IToolbarBuilder<T>
    Build: () => ReactNode;
}

export interface IEntity {
    id: string
}

export class TableBuilder<T extends IEntity> implements ITableBuilder<T> {

    // Columns header definitions and column cell definitions
    columnHeaders: ColumnHeaderConfiguration[] = [];
    columns: ColumnConfiguration[] = [];

    // Context variables
    toolbarContext: ToolbarBuilder<T> | null = null;
    columnContext: ColumnBuilder<T> | null = null;
    pagingContext: PagingBuilder<T> | null = null;
    themeContext: ThemeBuilder<T> | null = null;
    authorizationContext: AuthorizationBuilder<T> | null = null;

    // symbol tables
    themeSymbolTable: Map<string, any> = new Map();
    authorizationSymbolTable: Map<string, any> = new Map();

    // Complete data and configuration variables to pass into model
    toolbarConfig?: ToolbarConfiguration;
    pagingConfig?: PagingConfiguration; 
    themeConfig?: ThemeConfiguration;
    authorizationConfig?: AuthorizationConfiguration;
    data: T[] = [];
    caption?: string;
    defaultSort?: keyof T;
    currentAccessRole?: string

    constructor(data: T[], currentAccessRole?: string) {
        this.data = data;
        this.currentAccessRole = currentAccessRole;
    }

    public static Table<TData extends IEntity>(data: TData[], currentAccessRole?: string): ITableBuilder<TData> {
        return new TableBuilder<TData>(data, currentAccessRole);
    }

    CurrentAccessRole = (currentAccessRole: string) : ITableBuilder<T> => {
        this.currentAccessRole = currentAccessRole;
        return this;
    }

    Paging = () : IPagingBuilder<T> => {
        this.pagingContext = new PagingBuilder(this, this.BuildPagingContext)
        return this.pagingContext;
    }

    Caption = (caption: string) : ITableBuilder<T> => {
        this.caption = caption;
        return this;
    }

    DefaultSort = (field: keyof T) : ITableBuilder<T> => {
        this.defaultSort = field;
        return this;
    }

    Toolbar = (tableName: string) : IToolbarBuilder<T> => {
        this.toolbarContext = new ToolbarBuilder(this, this.BuildToolbarContext, tableName)
        return this.toolbarContext;
    }
    
    Theme = () : IThemeBuilder<T> => {
        this.themeContext = new ThemeBuilder(this, this.BuildThemeContext);
        return this.themeContext;
    }

    Column = (label?: string, numeric?: boolean) : IColumnBuilder<T> => {
        if(this.columnContext) {
            this.BuildColumnContext();
        }

        this.columnContext = new ColumnBuilder(this, this.BuildColumnContext, label, numeric);
        return this.columnContext;
    }

    Authorization = () : IAuthorizationBuilder<T> => {
        this.authorizationContext = new AuthorizationBuilder(this, this.BuildAuthorizationContext);
        return this.authorizationContext;
    }

    private BuildToolbarContext = () => {
        this.toolbarConfig = this.toolbarContext!.Build();
        this.toolbarContext = null;
    }

    private BuildAuthorizationContext = () => {
        this.authorizationConfig = this.authorizationContext!.Build();
        this.authorizationSymbolTable = this.authorizationConfig.symbolTable;
        this.authorizationContext = null;
    }

    private BuildThemeContext = () => {
        this.themeConfig = this.themeContext!.Build();
        this.themeSymbolTable = this.themeConfig.themeSymbolTable;
        this.themeContext = null;
    }

    private BuildPagingContext = () => {
        this.pagingConfig = this.pagingContext!.Build();
        this.pagingContext = null;
    }

    private BuildColumnContext = () => {
        this.columnHeaders.push(this.columnContext!.BuildHeaderConfig(this.themeSymbolTable, this.authorizationSymbolTable))
        this.columns.push(this.columnContext!.BuildConfig(this.themeSymbolTable, this.authorizationSymbolTable))
        this.columnContext = null;
    }

    Selectable = () : ITableBuilder<T> => {
        
        const cBuilder = new ColumnBuilder<T>(this, () => {});
        this.columnHeaders.push(cBuilder.BuildSelectableHeaderConfig());
        this.columns.push(cBuilder.BuildSelectableColumnConfig());

        return this;
    }

    Build = () : ReactNode => {
        return <MetaTable
        currentAccessRole={this.currentAccessRole}
        pagingConfig={this.pagingConfig} 
        defaultSorting={this.defaultSort} 
        caption={this.caption} 
        data={this.data} 
        toolbarConfig={this.toolbarConfig} 
        columnHeaders={this.columnHeaders} 
        columns={this.columns}/>
    }
}
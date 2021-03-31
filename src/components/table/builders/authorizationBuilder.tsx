import React from "react";
import { IEntity, ITableBuilder } from "./tableBuilder";

export interface IAuthorizationBuilder<T extends IEntity> {
    AccessRole: (accessRole: string) => IAuthorizationBuilder<T>
    End: () => ITableBuilder<T>
}

export type AuthorizationConfiguration = {
    symbolTable: Map<string, any>
}

export class AuthorizationBuilder<T extends IEntity> implements IAuthorizationBuilder<T> {

    tableBuilder: ITableBuilder<T>
    completionHandler: () => void;

    symbolTable: Map<string, any> = new Map();

    constructor(tableBuilder: ITableBuilder<T>, completionHandler: () => void) {
        this.tableBuilder = tableBuilder;
        this.completionHandler = completionHandler;
    }

    AccessRole = (accessRole: string) : IAuthorizationBuilder<T> => {
        this.symbolTable.set(accessRole, accessRole)
        return this;
    }

    End = () : ITableBuilder<T> => {
        this.completionHandler();
        return this.tableBuilder;
    }

    Build = () : AuthorizationConfiguration => {
        return {
            symbolTable: this.symbolTable
        };
    }
}
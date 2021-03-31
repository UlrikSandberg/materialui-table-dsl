import { IColumnBuilder } from "./columnBuilder";
import { IPagingBuilder } from "./pagingBuilder";
import { IEntity, ITableBuilder } from "./tableBuilder";
import { IThemeBuilder } from "./themeBuilder";

/*export interface IBaseBuilder<T extends IEntity> {
    Column: (label?: string, numeric?: boolean) => IColumnBuilder<T>
    Paging: () => IPagingBuilder<T>
    Theme: () => IThemeBuilder<T>
    Toolbar: (tableName?: string) => ITableBuilder<T>

}

export abstract class BaseBuilder<T extends IEntity> implements IBaseBuilder<T> {


}*/
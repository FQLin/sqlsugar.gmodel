export class ColumnInfo{
    /**
     * table name
     */
    TableName!: string;

    /**
     * table id
     */
    TableId!: string;

    /**
     * column name
     */
    DbColumnName!: string;

    /**
     * data type
     */
    DataType!: string;

    /**
     * length
     */
    Length!: number;

    /**
     * column description
     */
    ColumnDescription!: string;

    /**
     * default value
     */
    DefaultValue!: string;

    /**
     * is can be null
     */
    IsNullable!: boolean;

    /**
     * is identity
     */
    IsIdentity!: boolean;

    /**
     * is primary key
     */
    IsPrimaryKey!: boolean;
}
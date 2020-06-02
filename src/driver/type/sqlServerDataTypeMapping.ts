const sqlServerDataTypeMapping={
    "varchar": "string",
    "nvarchar": "string",
    "bigint": "long",
    "bit": "bool",
    "uniqueidentifier": "Guid",
    "tinyint": "byte",
    "money": "decimal",
    "int": "int",
    "float": "float",
    "decimal": "decimal",
    "datetime": "DateTime",
    "char": "string"
};

export default sqlServerDataTypeMapping;
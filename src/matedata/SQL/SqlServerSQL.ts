import { IQuerySQL } from "./IQuerySQL";

export class SqlServerSQL implements IQuerySQL{
    readonly TableInfoSql: string="SELECT s.Name,Convert(varchar(max),tbp.value) as Description FROM sysobjects s LEFT JOIN sys.extended_properties as tbp ON s.id=tbp.major_id and tbp.minor_id=0 AND (tbp.Name='MS_Description' OR tbp.Name is null)  WHERE s.xtype IN('U')";
    readonly ViewInfoSql: string="SELECT s.Name,Convert(varchar(max),tbp.value) as Description FROM sysobjects s LEFT JOIN sys.extended_properties as tbp ON s.id=tbp.major_id and tbp.minor_id=0  AND (tbp.Name='MS_Description' OR tbp.Name is null) WHERE s.xtype IN('V')";
    GetColumnInfosByTableNameSql(tableName: string): string {
        return `SELECT sysobjects.name AS TableName,
        syscolumns.Id AS TableId,
        syscolumns.name AS DbColumnName,
        systypes.name AS DataType,
        syscolumns.length AS [Length],
        sys.extended_properties.[value] AS [ColumnDescription],
        syscomments.text AS DefaultValue,
        syscolumns.isnullable AS IsNullable,
        columnproperty(syscolumns.id,syscolumns.name,'IsIdentity')as IsIdentity,
        (CASE
             WHEN EXISTS
                    (
                             select 1
                             from sysindexes i
                             join sysindexkeys k on i.id = k.id and i.indid = k.indid
                             join sysobjects o on i.id = o.id
                             join syscolumns c on i.id=c.id and k.colid = c.colid
                             where o.xtype = 'U'
                             and exists(select 1 from sysobjects where xtype = 'PK' and name = i.name)
                             and o.name=sysobjects.name and c.name=syscolumns.name
                    ) THEN 1
             ELSE 0
         END) AS IsPrimaryKey
 FROM syscolumns
 INNER JOIN systypes ON syscolumns.xtype = systypes.xtype
 LEFT JOIN sysobjects ON syscolumns.id = sysobjects.id
 LEFT OUTER JOIN sys.extended_properties ON (sys.extended_properties.minor_id = syscolumns.colid
                                             AND sys.extended_properties.major_id = syscolumns.id)
 LEFT OUTER JOIN syscomments ON syscolumns.cdefault = syscomments.id
 WHERE syscolumns.id IN
     (SELECT id
      FROM sysobjects
      WHERE xtype IN('u',
                     'v') )
   AND (systypes.name <> 'sysname')
   AND sysobjects.name='${tableName}'
   AND systypes.name<>'geometry'
   AND systypes.name<>'geography'
 ORDER BY syscolumns.colid`;
    }

}
let DbFirstTemplate = {
    KeyUsing : "{using}",
    KeyNamespace : "{Namespace}",
    KeyClassName : "{ClassName}",
    KeyIsNullable : "{IsNullable}",
    KeySugarTable : "{SugarTable}",
    KeyConstructor : "{Constructor}",
    KeySugarColumn : "{SugarColumn}",
    KeyPropertyType : "{PropertyType}",
    KeyPropertyName : "{PropertyName}",
    KeyDefaultValue : "{DefaultValue}",
    KeyClassDescription : "{ClassDescription}",
    KeyPropertyDescription : "{PropertyDescription}",

    PropertySpace: "        ",
    ClassSpace: "    ",
    ClassInnerSpace: "            ",
    
    UsingTemplate : `using SqlSugar;\r\nusing System;\r\nusing System.Linq;\r\nusing System.Text;\r\n`, 
};
DbFirstTemplate.ValueSugarTable = `\r\n${DbFirstTemplate.ClassSpace}[SugarTable(\"{0}\")]`;
DbFirstTemplate.ValueSugarCoulmn = `\r\n${DbFirstTemplate.PropertySpace}[SugarColumn({0})]`;
DbFirstTemplate.ClassTemplate = DbFirstTemplate.KeyUsing+"\r\n" +
        `namespace ${DbFirstTemplate.KeyNamespace}\r\n` +
        "{\r\n" +
        "{ClassDescription}{SugarTable}\r\n" +
        `${DbFirstTemplate.ClassSpace}public partial class ${DbFirstTemplate.KeyClassName}\r\n` +
        DbFirstTemplate.ClassSpace + "{\r\n" +
        `${DbFirstTemplate.PropertySpace}public ${DbFirstTemplate.KeyClassName}(){\r\n\r\n` +
        "{Constructor}\r\n" +
        DbFirstTemplate.PropertySpace + "}\r\n" +
        "{PropertyName}\r\n" +
        DbFirstTemplate.ClassSpace + "}\r\n" +
        "}\r\n";
DbFirstTemplate.ClassDescriptionTemplate = `${DbFirstTemplate.ClassSpace}///<summary>\r\n${DbFirstTemplate.ClassSpace}///${DbFirstTemplate.KeyClassDescription}${DbFirstTemplate.ClassSpace}///</summary>`;
DbFirstTemplate.ConstructorTemplate = `${DbFirstTemplate.ClassInnerSpace}this.{PropertyName} ={DefaultValue};\r\n`;
DbFirstTemplate.PropertyDescriptionTemplate = `${DbFirstTemplate.PropertySpace}/// <summary>\r\n${DbFirstTemplate.PropertySpace}/// Desc:${DbFirstTemplate.KeyPropertyDescription}\r\n${DbFirstTemplate.PropertySpace}/// Default:${DbFirstTemplate.KeyDefaultValue}\r\n${DbFirstTemplate.PropertySpace}/// Nullable:${DbFirstTemplate.KeyIsNullable}\r\n${DbFirstTemplate.PropertySpace}/// </summary>`;
DbFirstTemplate.PropertyTemplate = `${DbFirstTemplate.PropertySpace}{SugarColumn}\r\n${DbFirstTemplate.PropertySpace}public {PropertyType} {PropertyName} {get;set;}\r\n`;

module.exports = DbFirstTemplate;
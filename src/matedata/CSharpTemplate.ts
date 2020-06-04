namespace CSharpTemplate{
    export const KeyUsing : string = "{using}";
    export const KeyNamespace : string = "{Namespace}";
    export const KeyClassName : string = "{ClassName}";
    export const KeyIsNullable : string = "{IsNullable}";
    export const KeySugarTable : string = "{SugarTable}";
    export const KeyConstructor : string = "{Constructor}";
    export const KeySugarColumn : string = "{SugarColumn}";
    export const KeyPropertyType : string = "{PropertyType}";
    export const KeyPropertyName : string = "{PropertyName}";
    export const KeyDefaultValue : string = "{DefaultValue}";
    export const KeyClassDescription : string = "{ClassDescription}";
    export const KeyPropertyDescription : string = "{PropertyDescription}";
    export const PropertySpace : string = "        ";
    export const ClassSpace : string = "    ";
    export const ClassInnerSpace : string = "            ";
    export const UsingTemplate : string = `using SqlSugar;\r\nusing System;\r\nusing System.Linq;\r\nusing System.Text;\r\n`;
    export const ValueSugarTable : string = `\r\n${ClassSpace}[SugarTable(\"{0}\")]`;
    export const ValueSugarCoulmn : string = `\r\n${PropertySpace}[SugarColumn({0})]`;
    export const ClassTemplate : string = `${KeyUsing}\r\n
        namespace ${KeyNamespace}\r\n
        {\r\n
            ${KeyClassDescription}${KeySugarTable}\r\n
            ${ClassSpace}public partial class ${KeyClassName}\r\n
            ${ClassSpace}{\r\n
                ${PropertySpace}public ${KeyClassName}()
                ${PropertySpace}{\r\n
                    ${ClassInnerSpace}${KeyConstructor}\r\n
                ${PropertySpace}}\r\n
                ${KeyPropertyName}\r\n
            ${ClassSpace}}\r\n
        }\r\n`;
    export const ClassDescriptionTemplate : string = `${ClassSpace}///<summary>\r\n${ClassSpace}///${KeyClassDescription}${ClassSpace}///</summary>`;
    export const ConstructorTemplate : string = `${ClassInnerSpace}this.${KeyPropertyName} =${KeyDefaultValue};\r\n`;
    export const PropertyDescriptionTemplate : string =
        `${PropertySpace}/// <summary>\r\n
        ${PropertySpace}/// Desc:${KeyPropertyDescription}\r\n
        ${PropertySpace}/// Default:${KeyDefaultValue}\r\n
        ${PropertySpace}/// Nullable:${KeyIsNullable}\r\n
        ${PropertySpace}/// </summary>`;
    export const PropertyTemplate : string = `${PropertySpace}${KeySugarColumn}\r\n${PropertySpace}public ${KeyPropertyType} ${KeyPropertyName} {get;set;}\r\n`;
}
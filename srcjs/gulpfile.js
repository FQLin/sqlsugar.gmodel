/// <binding />
"use strict";


const dbToModel = require("./devTool/dbToModel/dbToModel");

let dtm=new dbToModel({
    connectionConfig:{
        user: "sa",
        password: "123456",
        server: "10.1.2.12",
        database: "HongYue"
    },
    nameSpace:"JC_GlobalSite.Core.Entity",
    isDefaultValue:false,
    isAttribute:false,
    outputPath:"./../../Framework/JC_GlobalSite.Core/Entity",
    /*ignoreDiagram:true,
    ignoreColumns:[
        
    ],
    mappingTables:{
        tbl_Role:"jc_role"
    },
    mappingColumns:{
        tbl_Role:{
            columns:{
                Name:"roleName"
            }
        }
    },
    mappingDataType:{
        nameSpace:"Enum",
        tbl_Role:{
            nameSpace:null,
            CreateDate:{
                dataType:"RoleDate",
                nameSpace:null
            },
            CreateUser:"UserDate"
        }
    }*/
});

dtm.apply();
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemaTable = exports.getListTables = exports.open = void 0;
// https://github.com/nuintun/node-adodb/blob/master/README-EN.md
const path_1 = __importDefault(require("path"));
const node_adodb_1 = __importDefault(require("node-adodb"));
const ListTypeFieldEnum = __importStar(require("./listTypeFieldEnum"));
// ADODB.PATH = './resources/adodb.js';
function open(positionDB) {
    const stringConnection = getStringConnection(positionDB);
    const connection = node_adodb_1.default.open(stringConnection);
    return connection;
}
exports.open = open;
function getStringConnection(positionDB) {
    const format = path_1.default.extname(positionDB);
    if (format.toLowerCase() == ".mdb") {
        return `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${positionDB};`;
    }
    else {
        return `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${positionDB};Persist Security Info=False;`;
    }
}
async function getListTables(connection) {
    // TABLE, LINK, ACCESS TABLE, SYSTEM TABLE, VIEW
    const result = [];
    try {
        const schema = await connection.schema(20);
        schema.forEach(table => {
            const { TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE, TABLE_GUID, DESCRIPTION, TABLE_PROPID, DATE_CREATED, DATE_MODIFIED } = table;
            const tableInfo = { TABLE_NAME, TABLE_TYPE, DATE_CREATED, DATE_MODIFIED };
            result.push(tableInfo);
        });
    }
    catch (error) {
        console.log(error);
    }
    return result;
}
exports.getListTables = getListTables;
;
async function getSchemaTable(connection, tableName) {
    // TABLE_CATALOG TABLE_SCHEMA TABLE_NAME COLUMN_NAME
    const result = [];
    try {
        const schema = await connection.schema(4, [null, null, tableName]);
        schema.forEach(column => {
            const { TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, COLUMN_GUID, COLUMN_PROPID, ORDINAL_POSITION, COLUMN_HASDEFAULT, COLUMN_DEFAULT, COLUMN_FLAGS, IS_NULLABLE, DATA_TYPE, TYPE_GUID, CHARACTER_MAXIMUM_LENGTH, CHARACTER_OCTET_LENGTH, NUMERIC_PRECISION, NUMERIC_SCALE, DATETIME_PRECISION, CHARACTER_SET_CATALOG, CHARACTER_SET_SCHEMA, CHARACTER_SET_NAME, COLLATION_CATALOG, COLLATION_SCHEMA, COLLATION_NAME, DOMAIN_CATALOG, DOMAIN_SCHEMA, DOMAIN_NAME, DESCRIPTION } = column;
            const DATA_TYPE_DESCRIPTION = ListTypeFieldEnum.getTypeDescription(DATA_TYPE);
            const columnInfo = { ORDINAL_POSITION, COLUMN_NAME, DATA_TYPE, DATA_TYPE_DESCRIPTION, COLUMN_DEFAULT };
            result.push(columnInfo);
        });
    }
    catch (error) {
        console.log(error);
    }
    return result;
}
exports.getSchemaTable = getSchemaTable;
;

// https://github.com/nuintun/node-adodb/blob/master/README-EN.md
import path from "path";
import ADODB from 'node-adodb';
import * as ListTypeFieldEnum from './listTypeFieldEnum';

// ADODB.PATH = './resources/adodb.js';

export function open(positionDB: string): ADODB.open {
    const stringConnection = getStringConnection(positionDB);
    const connection = ADODB.open(stringConnection);
    return connection;
}

function getStringConnection(positionDB: string): string {
    const format = path.extname(positionDB);
    if (format.toLowerCase() == ".mdb") {
        return `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${positionDB};`;
    } else {
        return `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${positionDB};Persist Security Info=False;`;
    }
}

export async function getListTables(connection: ADODB.open): Promise<any[]> {
    // TABLE, LINK, ACCESS TABLE, SYSTEM TABLE, VIEW
    const result: Array<any> = [];
    try {
        const schema: Array<any> = await connection.schema(20);
        schema.forEach(table => {
            const {TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE, TABLE_GUID, DESCRIPTION, TABLE_PROPID, DATE_CREATED, DATE_MODIFIED} = table
            const tableInfo = {TABLE_NAME, TABLE_TYPE, DATE_CREATED, DATE_MODIFIED}
            result.push(tableInfo);
        });
    } catch (error) {
        console.log(error);
    }
    return result;
};

export async function getSchemaTable(connection: ADODB.open, tableName: string): Promise<any[]> {
    // TABLE_CATALOG TABLE_SCHEMA TABLE_NAME COLUMN_NAME
    const result: Array<any> = [];
     try {
        const schema: Array<any> = await connection.schema(4, [null, null, tableName]);
        schema.forEach(column => {
            const {
                TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, COLUMN_GUID, COLUMN_PROPID, ORDINAL_POSITION, COLUMN_HASDEFAULT, COLUMN_DEFAULT,
                COLUMN_FLAGS, IS_NULLABLE, DATA_TYPE, TYPE_GUID, CHARACTER_MAXIMUM_LENGTH, CHARACTER_OCTET_LENGTH, NUMERIC_PRECISION, NUMERIC_SCALE,
                DATETIME_PRECISION, CHARACTER_SET_CATALOG, CHARACTER_SET_SCHEMA, CHARACTER_SET_NAME, COLLATION_CATALOG, COLLATION_SCHEMA, COLLATION_NAME,
                DOMAIN_CATALOG, DOMAIN_SCHEMA, DOMAIN_NAME, DESCRIPTION
            } = column;
            const DATA_TYPE_DESCRIPTION = ListTypeFieldEnum.getTypeDescription(DATA_TYPE);
            const columnInfo = {ORDINAL_POSITION, COLUMN_NAME, DATA_TYPE, DATA_TYPE_DESCRIPTION, COLUMN_DEFAULT};
            result.push(columnInfo);
        });
    } catch (error) {
       console.log(error);
    }
    return result;
};

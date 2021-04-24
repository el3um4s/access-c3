const { ipcRenderer } = require('electron');

ElectronRenderer.buttonChooseDatabase_EventListener = buttonChooseDatabase_EventListener;
ElectronRenderer.showSchemaTable = sendRequest_SchemaTable;

ipcRenderer.on('list-tables', async (event, arg) => {
	ElectronStorage.listTables = arg;
	ElectronStorage.listTablesType = new Set();
	
	g_runtime.callFunction("ListTables_Clear");
	g_runtime.callFunction("ListTables_Filter_Clear");
	
	
	
	ElectronStorage.listTables.forEach(table => {
		g_runtime.callFunction("ListTables_Add", table.TABLE_NAME);
		ElectronStorage.listTablesType.add(table.TABLE_TYPE);
	});
	
	g_runtime.callFunction("ListTables_Filter_Add", "ALL");
	ElectronStorage.listTablesType.forEach(tableType => {
		g_runtime.callFunction("ListTables_Filter_Add", tableType);
	});
});


ipcRenderer.on('schema-table', async (event, arg) => {
	ElectronStorage.listColumns = arg;
	ElectronStorage.listColumns.sort(compareColumnsOrder);
	
	g_runtime.callFunction("ListTables_Columns_Clear");
	
	ElectronStorage.listColumns.forEach(column => {
		g_runtime.callFunction("ListTables_Columns_Add", column.COLUMN_NAME);
	});	
});


function buttonChooseDatabase_EventListener() {
	const chooseDatabase = document.getElementById("choose-database");
	chooseDatabase.addEventListener("change", handleFiles, false);
}

function sendRequest_SchemaTable(tableName) {
	const path = ElectronStorage.pathDatabase;
	ipcRenderer.send("schema-table", { path, tableName });
}

function handleFiles() {
    const fileList = this.files;
    if (fileList) {
        const file = fileList[0];
        console.log(file);
        const name = file.name;
        const path = file.path;
		ElectronStorage.pathDatabase = path;
		ipcRenderer.send("list-tables", { name, path });
    }
}

function compareColumnsOrder(a, b) {
	const x = parseInt(a.ORDINAL_POSITION);
	const y = parseInt(b.ORDINAL_POSITION);
	const result = x < y ? -1 : x > y ? 1 : 0;
 	return result;
}

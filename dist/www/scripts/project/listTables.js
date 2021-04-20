export function showListTable_FilterByType(tableType) {
	g_runtime.callFunction("ListTables_Clear");
	if (tableType == "ALL" || tableType == "" || tableType == null) {
		showListTable(ElectronStorage.listTables);
	} else {
		const listFiltered = ElectronStorage.listTables.filter(table => table.TABLE_TYPE == tableType);
		showListTable(listFiltered);
	}
}

function showListTable(listTables) {
	g_runtime.callFunction("ListTables_Clear");
	listTables.forEach(table => {
		g_runtime.callFunction("ListTables_Add", table.TABLE_NAME);
	})
}

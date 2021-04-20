"use strict";

// import Globals from "./globals.js";
import * as ListTables from "./listTables.js";
// import * as ipcRenderer from "./renderer.js";

{
	const scriptsInEvents = {

		async Main_Event3_Act3(runtime, localVars)
		{
			ElectronRenderer.buttonChooseDatabase_EventListener();
		},

		async Main_Event5_Act2(runtime, localVars)
		{
			const filter = localVars.filter;
			ListTables.showListTable_FilterByType(filter);
		},

		async Main_Event7_Act2(runtime, localVars)
		{
			const tableName = localVars.tableName;
			ElectronRenderer.showSchemaTable(tableName);
		},

		async Main_Event9_Act3(runtime, localVars)
		{
			const columnName = localVars.columnName;
			const listColumns = ElectronStorage.listColumns;
			const column = listColumns.filter( col => col.COLUMN_NAME == columnName);
			const columnInfo = column[0];
			
			const txtData = runtime.objects.txtData.getAllInstances();
			txtData.forEach(txt => {
			  	const dataName = txt.instVars.dataName;
			  	txt.text = `${columnInfo[dataName]}`;
			})
		}

	};
	
	self.C3.ScriptsInEvents = scriptsInEvents;
}

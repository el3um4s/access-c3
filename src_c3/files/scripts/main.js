runOnStartup(async runtime => {	
	globalThis.g_runtime = runtime;
	globalThis.ElectronStorage ={
		pathDatabase: "",
		listTables: [],
		listTablesType: new Set(),
		listColumns: []
	}
	globalThis.ElectronRenderer = {
		buttonChooseDatabase_EventListener: () => {},
		showSchemaTable: () => {}
	};

	try {
		await runtime.assets.loadScripts("renderer.js");
	} catch (error) {
		console.log(error);
	}
});
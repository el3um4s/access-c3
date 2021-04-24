const { ipcRenderer } = require('electron');

ipcRenderer.on('message', function(event, text) {
	const messageFromElectron = g_runtime.objects.MessageFromElectron.getFirstInstance();
	messageFromElectron.text= text;
})
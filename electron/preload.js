const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('tododolix', {});

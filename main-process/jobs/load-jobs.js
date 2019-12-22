const path = require('path')
const fs = require('fs');
const { ipcMain } = require('electron')

ipcMain.on('asy-message-loadjobs', (event, arg) => {
    event.sender.send('asy-message-loadjobs-reply', readJobDataDir());
})

function readJobDataDir() {
    //console.log("gogo");
    var dataPath = "./job_data";
    //var allfiles = [];
    var i = 0;
    var files = fs.readdirSync(dataPath);
    return files;
}
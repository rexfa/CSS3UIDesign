const path = require('path')
const fs = require('fs');
const { ipcMain } = require('electron')

ipcMain.on('asy-message-loadjobs', (event, arg) => {
    event.sender.send('asy-message-loadjobs-reply', readJobDataDir());
})

function readJobDataDir() {
    console.log("gogo");
    let dataPath = "\job_data";
    let allfiles;
    fs.readdir(dataPath, function(err, files) {
        if (err) return console.log(err);
        allfiles = files;
        return files
    });
    return allfiles;
}
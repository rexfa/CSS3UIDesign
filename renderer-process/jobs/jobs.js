//引用任务模板

//const jobinfoLink = document.querySelector('.template-file').querySelectorAll('link[rel="import"]')
//const jobinfoLink = document.querySelectorAll('link[rel="jobs"]')
//let templatefile = jobinfoLink[0].import
//let jobinfotemplate = jobinfoLink[0].import.querySelector('.task-template')

//let jobinfoclone = document.importNode(jobinfotemplate.content, true)
//document.querySelector('.jobspanel').appendChild(jobinfoclone)
var CheckDirIntervalID = 0;

function callJobsDir() {
    //ipcRenderer.send('asy-message-loadjobs', 'ping');
    //document.getElementById("jobs-log").innerHTML="Call setInterval";
    let files = readJobDataDir();
    for (var key in files) {
        console.log(files[key]);
        let j = getJobInfoPanelByJobName(files[key]);
        if (!j) {
            addJobInfoPanel(files[key]);
        }
    }
    this.CheckDirIntervalID = (callJobsDir, 5000);
}

function readJobDataDir() {
    //var path = require('path')
    window.clearInterval(this.CheckDirIntervalID);
    var fs = require('fs');
    var dataPath = ".\\job_data";
    //document.getElementById("jobs-log").innerHTML=dataPath;
    var files = fs.readdirSync(dataPath);
    return files;
}
//每5秒检查一下目录
this.CheckDirIntervalID = setInterval(callJobsDir, 5000);
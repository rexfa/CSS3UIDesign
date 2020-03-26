/* 打开和关闭操作面板 */
function operationonclick(jobName) {
    var controlpanelID = "controlpanel" + jobName;
    var controlpanel = document.getElementById(controlpanelID);
    var taskpanelID = "taskpanel" + jobName;
    var taskpanel = document.getElementById(taskpanelID);
    var taskinfopanelID = "taskinfopanel" + jobName;
    var taskinfopanel = document.getElementById(taskinfopanelID);
    var taskhrID = "taskhr" + jobName;
    var taskhr = document.getElementById(taskhrID);
    //var infopanel = 
    if (controlpanel.classList.contains("hidden")) {

        controlpanel.classList.remove("hidden");

    } else {
        controlpanel.classList.add("hidden");
    }
}

function operationcloseonclick(jobName) {
    var controlpanelID = "controlpanel" + jobName;
    var controlpanel = document.getElementById(controlpanelID);
    controlpanel.classList.add("hidden");
}

function readJobDataDir() {
    //var path = require('path')
    window.clearInterval(this.CheckDirIntervalID);
    var fs = require('fs');
    //var dataPath = __dirname + "./job_data";
    var dataPath = "./job_data";
    //document.getElementById("jobs-log").innerHTML=dataPath;
    var files = fs.readdirSync(dataPath);
    return files;
}


function jobsTest() {
    let ramboName = (+new Date).toString(36)
    addJobInfoPanel(ramboName)
}
//引用模板
function importJobInfoTemplate() {
    let template = document.getElementsByClassName("jobstemplate")
    let clone = template[0].children[0].cloneNode(true)
    setTTTime(clone)
    let workspace = document.getElementsByClassName('jobs-workspace-wrapper')
    workspace[0].appendChild(clone)
}
//获取所有的panel
function getAllJobInfoPanel() {
    let jobs = document.getElementsByClassName('jobs-workspace-wrapper')[0].getElementsByClassName("taskpanel");
    return jobs;
}
//获取指定name的panel
function getJobInfoPanelByJobName(jobName) {
    let job = document.getElementById("taskpanel" + jobName);
    return job;
}


function setJTTTime(jobInfoNode) {
    let tt = jobInfoNode.getElementsByClassName("task-runtime")[0];
    let dom = document.createElement('em');
    //dom.className='book';
    dom.innerHTML = CurentTime();
    tt.appendChild(dom);
}

function setJITTime(jobInfoNode) {
    let tt = jobInfoNode.getElementsByClassName("task-inputtime")[0];
    let dom = document.createElement('em');
    //dom.className='book';
    dom.innerHTML = CurentTime();
    tt.appendChild(dom);
}



/* 显示选择脚本 */
function selectscriptonclick(jobName) {
    var taskpanelID = "taskpanel" + jobName;
    var taskpanel = document.getElementById(taskpanelID);
    var topPlus0 = taskpanel.offsetTop;
    //var topPlus1 = window.pageYOffset;
    //var topPlus2 = document.documentElement.scrollTop;
    //var topPlus3 = document.body.scrollTop;
    //console.log(topPlus0);
    //console.log(topPlus1);
    //console.log(topPlus2);
    //console.log(topPlus3);
    var scriptselector = document.getElementsByClassName("jobscripttemplate")[0];
    scriptselector.classList.remove("hidden");
    scriptselector.style.top = 100 + topPlus0 - 30 + "px"; //根据按键所在的div位置设定脚本选择的位置
    let btnSelectScriptSave = document.getElementsByClassName("jobscriptsave-button")[0];
    btnSelectScriptSave.setAttribute("onclick", "selectscriptsaveonclick('" + jobName + "')");
    setCloneDomContent(scriptselector, "script-jobname", "script-jobname", jobName);
}
/*保存选择脚本，让选择界面消失 */
function selectscriptsaveonclick(jobName) {
    var scriptselector = document.getElementsByClassName("jobscripttemplate")[0];
    scriptselector.classList.add("hidden");
    var jobscriptradio = document.getElementsByName("jobscriptradio");
    for (i = 0; i < jobscriptradio.length; i++) {
        if (jobscriptradio[i].checked) {
            setDomContent("taskoperation" + jobName, jobscriptradio[i].value); //设置内容
        }
    }
}
/*优先开始*/
function prioritystartonclick(jobName) {
    //var taskstatusdom = document.getElementById("taskstatus" + jobName);
    //taskstatusdom.innerHTML = "开始";
    //setDomContent("taskstatus" + jobName, '0%');
    //setInterval(function() { callSetJobsStatus("taskstatus" + jobName) }, 2000); //暂时不结束这个Interval

    const settings = require('electron-settings');
    var corealgorithmurlValue = settings.get('corealgorithmurl');
    var corealgorithmcmdValue = settings.get('corealgorithmcmd');

    //lib
    runSpawnWithPathCmd(corealgorithmurlValue, corealgorithmcmdValue, "taskstatus" + jobName);

    operationcloseonclick(jobName);
}
//显示进度
function callSetJobsStatus(taskstatusDOMId) {
    let cvalue = parseInt(getDomContent(taskstatusDOMId));
    if (cvalue < 100) {
        cvalue = cvalue + 5;
        setDomContent(taskstatusDOMId, cvalue + '%');
    }
}
//创建一个工作面板
function addJobInfoPanel(jobName) {
    let template = document.getElementsByClassName("jobstemplate");
    let clone = template[0].children[0].cloneNode(true);
    clone.setAttribute("id", "taskpanel" + jobName);

    setCloneDomContent(clone, "task-name", "taskname" + jobName, jobName);
    setCloneDomContent(clone, "task-operation", "taskoperation" + jobName, "准备完毕");
    setCloneDomContent(clone, "task-status", "taskstatus" + jobName, "准备");
    setCloneDomContent(clone, "task-scale", "taskscale" + jobName, "10G");
    let btnOperation = clone.getElementsByClassName("job-operation")[0];
    btnOperation.setAttribute("onclick", "operationonclick('" + jobName + "')");
    let btnOperationClose = clone.getElementsByClassName("job-operation-close")[0];
    btnOperationClose.setAttribute("onclick", "operationcloseonclick('" + jobName + "')");

    let btnSelectScript = clone.getElementsByClassName("select-script")[0];
    btnSelectScript.setAttribute("onclick", "selectscriptonclick('" + jobName + "')");
    let btnPriorityStart = clone.getElementsByClassName("priority-start")[0];
    btnPriorityStart.setAttribute("onclick", "prioritystartonclick('" + jobName + "')");
    let controlpanel = clone.getElementsByClassName("controlpanel")[0];
    controlpanel.setAttribute("id", "controlpanel" + jobName);
    let taskinfopanel = clone.getElementsByClassName("taskinfopanel")[0];
    taskinfopanel.setAttribute("id", "taskinfopanel" + jobName);
    let taskhr = clone.getElementsByClassName("task-hr")[0];
    taskhr.setAttribute("id", "taskhr" + jobName);
    setJITTime(clone);
    setJTTTime(clone);
    document.getElementsByClassName('jobs-workspace-wrapper')[0].appendChild(clone);
}

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
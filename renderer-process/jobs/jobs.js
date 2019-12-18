/* 添加动画用 */
function operationonclick(taskname) {
    var controlpanelID = "controlpanel" + taskname;
    var controlpanel = document.getElementById(controlpanelID);
    var taskpanelID = "taskpanel" + taskname
    var taskpanel = document.getElementById(taskpanelID);
    if (controlpanel.className == "controlpanel-hidden") {
        taskpanel.style.height = 350;
        controlpanel.className = "controlpanel-display";
    } else {
        controlpanel.className = "controlpanel-hidden";
        taskpanel.style.height = 200;
    }
}
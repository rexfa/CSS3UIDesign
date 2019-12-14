/* 添加动画用 */
function operationonclick(taskname) {
    var controlpanelID = "controlpanel" + taskname;
    var controlpanel = document.getElementById(controlpanelID);
    if (controlpanel.className == "controlpanel-hidden") {
        controlpanel.className = "controlpanel-display";
    } else {
        controlpanel.className = "controlpanel-hidden";
    }

}
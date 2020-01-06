//引用任务模板

//const jobinfoLink = document.querySelector('.template-file').querySelectorAll('link[rel="import"]')
//const jobinfoLink = document.querySelectorAll('link[rel="jobs"]')
//let templatefile = jobinfoLink[0].import
//let jobinfotemplate = jobinfoLink[0].import.querySelector('.task-template')

//let jobinfoclone = document.importNode(jobinfotemplate.content, true)
//document.querySelector('.jobspanel').appendChild(jobinfoclone)
var CheckDirIntervalID = 0;
//每5秒检查一下目录
this.CheckDirIntervalID = setInterval(callJobsDir, 5000);

var jobstestBtn = document.getElementById('jobs-test');
jobstestBtn.addEventListener('click',jobsTest);
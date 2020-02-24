//引用任务模板

var CheckDirIntervalID = 0;
//每5秒检查一下目录
this.CheckDirIntervalID = setInterval(callJobsDir, 5000);

var jobstestBtn = document.getElementById('jobs-test');
jobstestBtn.addEventListener('click', jobsTest);
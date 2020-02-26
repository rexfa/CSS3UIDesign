/*
var Lib_CpuRuler = [];

function lib_appsysCPUInfo(cpus, cpuRuler) {
    if (cpuinfoconfig.data.datasets.length > 0) {
        var xdata = ' ';
        cpuinfoconfig.data.labels.push(xdata);
        //console.log(cpus[0].times.idle);
        cpuinfoconfig.data.datasets.forEach((dataset, idx, arr) => {
            var times = cpus[idx].times;
            var timesRuler = cpuRuler[idx].times;
            var cpudata = `${((1-(times.idle-timesRuler.idle)/((times.idle-timesRuler.idle)+(times.user-timesRuler.user)+(times.nice-timesRuler.nice)+(times.sys-timesRuler.sys)+(times.irq-timesRuler.irq)))*100).toFixed(2)}`;

            dataset.data.push(cpudata);
        });
    }
}
*/

function lib_getAllCPUUsages() {
    var os = require('os');
    var cpusTime;
    var getNum = 0;
    var getNumMax = 2;
    var cpuUsages = [];
    var waitSec;
    waitSec = this.setInterval(function() {
        if (getNum == getNumMax - 1) {
            clearInterval(waitSec);
            console.log('Clear Interval: ' + waitSec);
            console.log('Show CPU Usages: ' + cpuUsages);
            return;
        }
        var cpus = os.cpus();
        if (getNum == 0) {
            cpusTime = new Array(getNumMax);
            cpusTime[getNum] = new Array(cpus.length);
        }
        cpus.forEach((cpu, idx, arr) => {
            cpusTime[getNum][idx] = cpu.times;
            if (getNum > 0) {
                var cpudata = `${((1-(cpusTime[getNum][idx].idle-cpusTime[getNum-1][idx].idle)/((cpusTime[getNum][idx].idle-cpusTime[getNum-1][idx].idle)+(cpusTime[getNum][idx].user-cpusTime[getNum-1][idx].user)+(cpusTime[getNum][idx].nice-cpusTime[getNum-1][idx].nice)+(cpusTime[getNum][idx].sys-cpusTime[getNum-1][idx].sys)+(cpusTime[getNum][idx].irq-cpusTime[getNum-1][idx].irq)))*100).toFixed(2)}`;
                cpuUsages.push(cpudata);
            }
        });
        getNum++;
    }, 1000);

}

function lib_showCPUUsages() {
    lib_getAllCPUUsages();
}
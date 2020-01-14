var cpuinfoconfig = {
    type: 'line',
    data: {},
    options: {
        responsive: true,
        legend: {
            labels: {
                fontColor: '#ff8c00'
            }
        },
        title: {
            display: true,
            text: 'CPU状态',
            fontColor: '#ff8c00'
        },
        tooltips: {
            mode: 'index',
            intersect: false
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '时间',
                    fontColor: '#ff8c00'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '使用率',
                    fontColor: '#ff8c00'
                },
                ticks:{
                    min: 0,
                    max:100
                }
            }]
        }
    }
};
var meminfoconfig = {
    type: 'line',
    data: {},
    options: {
        responsive: true,
        legend: {
            labels: {
                fontColor: '#ff8c00'
            }
        },
        title: {
            display: true,
            text: '内存状态',
            fontColor: '#ff8c00'
        },
        tooltips: {
            mode: 'index',
            intersect: false
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '时间',
                    fontColor: '#ff8c00'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '使用率',
                    fontColor: '#ff8c00'
                },
                ticks:{
                    min: 0,
                    max:100
                }
            }]
        }
    }
};

function addDataset_appsysCPUInfo(cpus) {
    var COLORS = [
        '#4dc9f6',
        '#f67019',
        '#f53794',
        '#537bc4',
        '#acc236',
        '#166a8f',
        '#00a950',
        '#58595b',
        '#8549ba'
    ];
    cpus.forEach((cpu, idx, arr) => {
        var newColor = COLORS[idx];
        //console.log(newColor);
        var newDataset = {
            label: `cpu${idx}`,
            backgroundColor: newColor,
            borderColor: newColor,
            data: [],
            fill: false
        };
        cpuinfoconfig.data.datasets.push(newDataset);
    });
    window.cpuinfoLine.update();
}

function removeData_appsysCPUInfo() {

    cpuinfoconfig.data.labels.shift(); // remove the label first
    cpuinfoconfig.data.datasets.forEach(function(dataset) {
        dataset.data.shift();
    });

    //window.cpuinfoLine.update();
}

function addData_appsysCPUInfo(cpus,cpuRuler) {
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

        //window.cpuinfoLine.update();
    }
}
function addData_appsysCPUInfoZeroData(){
    if (cpuinfoconfig.data.datasets.length > 0) {
        var xdata = ' ';
        cpuinfoconfig.data.labels.push(xdata);
        //console.log(cpus[0].times.idle);
        cpuinfoconfig.data.datasets.forEach((dataset, idx, arr) => {
            dataset.data.push(0);
        });
        //window.cpuinfoLine.update();
    }
}
var CpuDataCapacity = 0;
var CpuRuler =[];
function updatacpuinfoLine() {
    var os = require('os');
    var cpus = os.cpus();    
    //console.log(cpus[0].model);
    if (CpuDataCapacity < 1) {
        CpuRuler = cpus;
        addDataset_appsysCPUInfo(cpus);
        for(;CpuDataCapacity<20;CpuDataCapacity++)
        {
            addData_appsysCPUInfoZeroData();
        }
    }else if (CpuDataCapacity >= 20) {
        removeData_appsysCPUInfo();
        CpuDataCapacity--;
        addData_appsysCPUInfo(cpus,CpuRuler);
        CpuDataCapacity++;
    }
    window.cpuinfoLine.update();
}
var MemDataCapacity = 0;

function updatameminfoLine() {
    var os = require('os');
    var totalMem = os.totalmem();
    var freeMem = os.freemem();
    if (MemDataCapacity < 1) {
        var newDataset = {
            label: `内存使用比例`,
            backgroundColor: '#4dc9f6',
            borderColor: '#4dc9f6',
            data: [],
            fill: true
        };
        meminfoconfig.data.datasets.push(newDataset);
        for(;MemDataCapacity<20;MemDataCapacity++)
        {
            meminfoconfig.data.labels.push(' ');
            meminfoconfig.data.datasets.forEach((dataset, idx, arr) => {
                dataset.data.push(0);
            });
        }
        window.meminfoLine.update();
    }
    if (MemDataCapacity > 20) {
        meminfoconfig.data.labels.shift();
        meminfoconfig.data.datasets.forEach((dataset, idx, arr) => {
            dataset.data.shift();
        });
        MemDataCapacity--;
    }
    meminfoconfig.data.labels.push(' ');
    meminfoconfig.data.datasets.forEach((dataset, idx, arr) => {
        var memdata = (1-(freeMem / totalMem)).toFixed(2) * 100;
        dataset.data.push(memdata);
    });
    //meminfoconfig.data.datasets[0].push((freeMem / totalMem).toFixed(2) * 100);
    MemDataCapacity++;
    window.meminfoLine.update();

}
var cpuinfointerval = 0;
var meminfointerval = 0;

window.onload = function() {
    var cpuctx = document.getElementById('appsysCPUInfo-chart-canvas').getContext('2d');
    window.cpuinfoLine = new Chart(cpuctx, cpuinfoconfig);
    cpuinfointerval = this.setInterval(updatacpuinfoLine, 5000);
    var memctx = document.getElementById('appsysMEMInfo-chart-canvas').getContext('2d');
    window.meminfoLine = new Chart(memctx, meminfoconfig);
    meminfointerval = this.setInterval(updatameminfoLine, 5000);
};
const os = require('os');
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
                }
            }]
        }
    }
};

function addDataset_appsysCPUInfo(cpus) {
    cpus.forEach((cpu, idx, arr) => {
        var newColor = window.chartColors[idx];
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

function addData_appsysCPUInfo(cpus) {
    if (cpuinfoconfig.data.datasets.length > 0) {
        var xdata = ' ';
        cpuinfoconfig.data.labels.push(xdata);

        cpuinfoconfig.data.datasets.forEach((dataset, idx, arr) => {
            var times = cpus[idx].times;
            var cpudata = `${((1-times.idle/(times.idle+times.user+times.nice+times.sys+times.irq))*100).toFixed(2)}`;
            console.log(cpudata);
            dataset.data.push(cpudata);
        });

        //window.cpuinfoLine.update();
    }
}
var DataCapacity = 0;

function updatacpuinfoLine() {
    var cpus = os.cpus();
    //console.log(cpus[0].model);
    if (DataCapacity < 1) {
        addDataset_appsysCPUInfo(cpus);
    }
    if (DataCapacity > 20) {
        removeData_appsysCPUInfo();
        DataCapacity--;
    }
    addData_appsysCPUInfo(cpus);
    DataCapacity++;
    window.cpuinfoLine.update();
}

var cpuinfointerval = 0;

window.onload = function() {
    var ctx = document.getElementById('appsysCPUInfo-chart-canvas').getContext('2d');
    window.cpuinfoLine = new Chart(ctx, cpuinfoconfig);
    cpuinfointerval = this.setInterval(updatacpuinfoLine, 5000)
};
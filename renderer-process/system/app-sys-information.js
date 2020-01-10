var cpuinfoconfig = {
    type: 'line',
    data: {
    },
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
function addDataset_appsysCPUInfo(cpus){
    cpus.forEach((cpu, idx, arr)=>{
        var newColor = window.chartColors[idx];
        var newDataset = {
            label: 'cpu${idx}',
            backgroundColor: newColor,
            borderColor: newColor,
            data: [],
            fill: false
        };
        cpuinfoconfig.data.datasets.push(newDataset);
    });
    window.cpuinfoLine.update();
}
function removeData_appsysCPUInfo(){
    config.data.labels.splice(-1, 1); // remove the label first

    config.data.datasets.forEach(function(dataset) {
        dataset.data.pop();
    });

    window.cpuinfoLine.update();
}
function addData_appsysCPUInfo(){
    if (cpuinfoconfig.data.datasets.length > 0) {
        var month = MONTHS[cpuinfoconfig.data.labels.length % MONTHS.length];
        cpuinfoconfig.data.labels.push(month);

        cpuinfoconfig.data.datasets.forEach(function(dataset) {
            dataset.data.push(randomScalingFactor());
        });

        window.cpuinfoLine.update();
    }
}
window.onload = function() {
    var ctx = document.getElementById('appsysCPUInfo-chart-canvas').getContext('2d');
    window.cpuinfoLine = new Chart(ctx, cpuinfoconfig);
};
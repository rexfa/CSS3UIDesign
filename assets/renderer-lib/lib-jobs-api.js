function runSpawn() {
    let iconv = require('iconv-lite');
    let spawn = require('child_process').spawn;

    let cmdStr = 'ping';
    // 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
    let cmdPath = './';
    // 子进程名称
    let workerProcess;
    var arr = [];
    var encodingName = "GBK";
    /*const productName = require('/package').productName
    switch (process.platform) {
        case 'darwin':
            encodingName = "utf8";
            break;
        case 'win32':
            encodingName = "GBK";
            break;
        case 'freebsd':
        case 'linux':
        case 'sunos':
            encodingName = "utf8";
            break;
        default:
            throw new Error(`Unknown userDataPath path for platform ${process.platform}`)
    }*/
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    //增加GBK编码
    workerProcess = spawn(cmdStr, ['-t', 'www.163.com'], { cwd: cmdPath, encoding: encodingName });
    //可写流stdin暂不测试  stdio的[0][1][2] 已经由stdin stdout 和stderr 单独实现
    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', function(data) {
        arr.push(data);
        //console.log(data);
        var arr1 = [];
        arr1.push(data);
        //console.log(" new data");
        console.log(iconv.decode(Buffer.concat(arr1), encodingName));
    });
    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });
    // 退出之后的输出
    workerProcess.on('close', function(code) {
        //console.log(arr); //utf8可能造成乱码
        //console.log(iconv.decode(Buffer.concat(arr), encodingName)); // 改成GBK模式 
        console.log('out code：' + code);
    });
    return workerProcess;
}

function runSpawnWithPathCmd(cmdPath, cmdStr) {
    let iconv = require('iconv-lite');
    let spawn = require('child_process').spawn;
    //let cmdStr = 'ping';
    // 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
    //let cmdPath = './';
    // 子进程名称
    let workerProcess;
    var arr = [];
    var encodingName = "GBK";
    /*const productName = require('/package').productName
    switch (process.platform) {
        case 'darwin':
            encodingName = "utf8";
            break;
        case 'win32':
            encodingName = "GBK";
            break;
        case 'freebsd':
        case 'linux':
        case 'sunos':
            encodingName = "utf8";
            break;
        default:
            throw new Error(`Unknown userDataPath path for platform ${process.platform}`)
    }*/
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    //增加GBK编码
    workerProcess = spawn(cmdStr, [], { cwd: cmdPath, encoding: encodingName });
    //可写流stdin暂不测试  stdio的[0][1][2] 已经由stdin stdout 和stderr 单独实现
    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', function(data) {
        arr.push(data);
        //console.log(data);
        var arr1 = [];
        arr1.push(data);
        //console.log(" new data");
        console.log(iconv.decode(Buffer.concat(arr1), encodingName));
    });
    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });
    // 退出之后的输出
    workerProcess.on('close', function(code) {
        //console.log(arr); //utf8可能造成乱码
        //console.log(iconv.decode(Buffer.concat(arr), encodingName)); // 改成GBK模式 
        console.log('out code：' + code);
    });
    return workerProcess;
}
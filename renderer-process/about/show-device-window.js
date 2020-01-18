const { BrowserWindow } = require('electron').remote;
const path = require('path');

const newdevWindowBtn = document.getElementById('new-dev-window');

newdevWindowBtn.addEventListener('click', (event) => {
    const modalPath = path.join('file://', __dirname, '../../sections/windows/show3d.html');
    let win = new BrowserWindow({ width: 600, height: 480, webPreferences: { nodeIntegration: true } });

    win.on('close', () => { win = null });
    win.loadURL(modalPath);
    win.show()
});
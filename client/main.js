const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// ready
app.on('ready', function () {
  mainWindow = createMainWindow();

  mainWindow.on('closed', function () {
    app.quit();
  });

});

// activate
app.on('activate', function () {
  if (mainWindow === null) {
    createMainWindow()
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function createMainWindow() {

    let win = new BrowserWindow({show: false });

    win.loadURL(url.format({
      pathname: path.join(__dirname, 'app.html'),
      protocol: 'file:',
      slashes: true
    }));

    win.once('ready-to-show', () => {
      win.show()
    })

    if( process.env.PHOTO_RATING_EXECUTABLE == null ){
      win.toggleDevTools();
    }

    createMenuItems();

    return win;
}

function createMenuItems() {
  var menu = electron.Menu.getApplicationMenu();

  menu.append(new electron.MenuItem({label: 'Restart', click: onRestartMenuClick}))

  electron.Menu.setApplicationMenu(menu)

  function onRestartMenuClick() {
    var folder = electron.dialog.showOpenDialog({properties: ['openDirectory']});

    if( folder != null && folder.length>0 ) {
      restartApplication(folder[0]);
    }    
  }

  function restartApplication(folder) {    
    console.log(folder);
  }
}
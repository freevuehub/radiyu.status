const path = require('path')
const { app, BrowserWindow, Tray, shell, nativeImage, Menu } = require('electron')

let tray = null
let window = null

const iconPath = path.join(__dirname, 'path/icon.png');

app.setName('웡웡')

const createWindow = () => {
  window = new BrowserWindow({
    show: false,
  })
  tray = new Tray(
    nativeImage.createFromPath(iconPath)
  )

  window.setTitle('머찐 라디유!')

  tray.on('click', async () => {
    await shell.openExternal('https://www.twitch.tv/radiyu')
  })
  tray.setToolTip('웡웡!')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '끝낼래요...', role: 'quit' },
  ]))
}

app.whenReady().then(() => {
  createWindow()

  app.hide()
  app.dock.hide()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

const path = require('path')
const { app, BrowserWindow, Tray, shell, nativeImage, Menu, Notification } = require('electron')

require('dotenv').config()

let tray = null
let window = null
let notification = null

const postAccessToken = async () => {
  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  )
  const data = await response.json()
  
  return data
}
const getStatus = async (token) => {
  const response = await fetch(
    `https://api.twitch.tv/helix/streams?user_login=${process.env.TWITCH_USER_ID}`,
    {
      method: 'GET',
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`
      },
    }
  )
  const { data } = await response.json()
  
  if (data.length === 0) {
    return setTimeout(() => {
      getStatus(token)
    }, 5000)
  } else {
    notification.show()
  
    notification.on('click', async () => {
      await shell.openExternal('https://www.twitch.tv/radiyu')
    })

    return data
  }
}

const iconPath = path.join(__dirname, 'path/icon.png');

app.setName('웡웡')

const createWindow = () => {
  window = new BrowserWindow({
    show: false,
  })
  tray = new Tray(
    nativeImage.createFromPath(iconPath)
  )
  notification = new Notification({
     title: '머찐 라디유!',
     body: '웡웡이들 집합해라!'
   })

  window.setTitle('머찐 라디유!')

  tray.on('click', async () => {
    await shell.openExternal('https://www.twitch.tv/radiyu')
  })
  tray.setToolTip('웡웡!')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '끝낼래요...', role: 'quit' },
  ]))
}

app.whenReady().then(async () => {
  createWindow()

  const { access_token } = await postAccessToken()

  await getStatus(access_token)
  
  app.hide()
  app.dock.hide()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

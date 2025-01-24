const{app,BrowserWindow} = require('electron')
const path = require('path')

function createMainWindow()
{
    const win = new BrowserWindow({
        width:800,
        height:600
    })
      // 加载本地打包好的文件
     // 根据 NODE_ENV 环境变量判断加载模式
    // 确保这里的路径是根目录下的 dist 文件夹
    const filePath = path.join(__dirname, '..', 'dist', 'index.html');
    console.log('Loading file from:', filePath); // 打印文件路径进行调试

    win.loadURL(`file://${filePath}`);
     
    //  if (process.env.NODE_ENV === 'development') {
    //     win.loadURL('http://localhost:5173');
    // } else {
    //     win.loadFile(path.join(__dirname, 'dist', 'index.html'));
    // }
}

app.whenReady().then(()=>{
    createMainWindow()
    app.on('activate',()=>{
        if(BrowserWindow.getAllWindows().length==0)
        {
            createMainWindow()
        }
    })
})

app.on('window-all-closed',()=>{
    if(process.platform!='darwin')
    {
        app.quit()
    }
})
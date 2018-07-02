import { app, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import * as url from "url";
import * as path from "path";

const IS_SERVE: boolean = process.argv.indexOf("--serve") !== -1;
const DEV_PORT: number = 4000;

app.on("ready", async () => {
    const window = new BrowserWindow();

    if (IS_SERVE) {
        require("electron-reload")(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        window.loadURL(`http://localhost:${DEV_PORT}`);
    } else {
        window.loadURL(
            url.format({
                pathname: path.join(__dirname, "dist/renderer/index.html"),
                protocol: "file:",
                slashes: true
            })
        );
        window.webContents.openDevTools();
    }
    const result = await autoUpdater.checkForUpdates();
    console.log(await result.downloadPromise!);
});

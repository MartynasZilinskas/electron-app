import { app, BrowserWindow } from "electron";
import * as url from "url";
import * as path from "path";

const IS_SERVE: boolean = process.argv.indexOf("--serve") !== -1;
const DEV_PORT: number = 4000;

app.on("ready", () => {
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
});

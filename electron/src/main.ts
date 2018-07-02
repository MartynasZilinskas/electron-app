import { app, BrowserWindow } from "electron";

const IS_SERVE: boolean = process.argv.indexOf("--serve") !== -1;
const DEV_PORT: number = 4000;

app.on("ready", () => {
    const window = new BrowserWindow();

    if (IS_SERVE) {
        window.loadURL(`http://localhost:${DEV_PORT}`);
    }
});

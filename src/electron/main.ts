import { app, BrowserWindow, dialog } from "electron";
import { autoUpdater, UpdateInfo } from "electron-updater";
import * as url from "url";
import * as path from "path";
import * as fs from "fs-extra";

const IS_SERVE: boolean = process.argv.indexOf("--serve") !== -1;
const DEV_PORT: number = 4000;

enum UpdateBoxOptions {
    DownloadNow = "Download Now",
    Later = "Later"
}

app.on("ready", async () => {
    const browserWindow = new BrowserWindow();

    if (IS_SERVE) {
        // tslint:disable-next-line:no-require-imports
        require("electron-reload")(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        browserWindow.loadURL(`http://localhost:${DEV_PORT}`);
    } else {
        browserWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, "dist/renderer/index.html"),
                protocol: "file:",
                slashes: true
            })
        );
        browserWindow.webContents.openDevTools();
    }
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.checkForUpdates();
    autoUpdater.on("update-available", (info: UpdateInfo) => {
        const buttons: string[] = [UpdateBoxOptions.DownloadNow, UpdateBoxOptions.Later];

        const buttonIndex = dialog.showMessageBox(browserWindow, {
            title: "Update is available",
            message: `New version update is available v${info.version}.`,
            buttons: buttons
        });

        if (buttons[buttonIndex] === UpdateBoxOptions.DownloadNow) {
            autoUpdater.downloadUpdate();
        }
    });
    autoUpdater.on("update-downloaded", async (info: UpdateInfo) => {
        try {
            autoUpdater.quitAndInstall();
        } catch {
            // @ts-ignore // TODO: Fix this hack.
            const cacheDir: string = autoUpdater.downloadedUpdateHelper.cacheDir;
            const srcLocation = path.resolve(cacheDir, info.path);

            const targetLocation = dialog.showSaveDialog(browserWindow, {
                title: "Save update",
                message: "Message.... blah blah blah",
                defaultPath: info.path
            });

            try {
                await fs.copy(srcLocation, targetLocation);
            } catch (error) {
                const message: string[] = [
                    "An error has occured while saving setup file.",
                    `Directory: "${cacheDir}"`,
                    `File: "${info.path}"`,
                    "",
                    `${error}`
                ];

                dialog.showErrorBox("Failed to save latest setup file", message.join("\n"));
            }
        }
    });
});

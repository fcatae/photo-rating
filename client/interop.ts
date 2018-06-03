import * as files from './server/files.js';

import { createVFolderTags } from './server/files.js';
import { VFile, VFolder } from './server/vfiles.js';

import { remote } from 'electron';

var vfolder: VFolder;

// PUBLIC
export function initVFolder(folder: string, tags: string[]) {
    vfolder = createVFolderTags(folder, tags);
}

export function getPrevImageVFile(): VFile {
    return vfolder.getPrevious();    
}

export function getNextImageVFile(): VFile {
    return vfolder.getNext();
}

export function changeTag(vfile: VFile, tag: string) {
    vfolder.changeFileTag(vfile, tag);
    vfolder.syncFile(vfile);
}

export function chooseSingleFolder(startFolder: string) : string {
    var dialogProperties : Electron.OpenDialogOptions = {
        defaultPath: startFolder,
        properties: ['openDirectory']
    };
    var folders = remote.dialog.showOpenDialog(dialogProperties);

    if( folders == null ) {
        return null;
    }

    return folders[0];
}

export function getDefaultPicturesFolder() {
    var home = process.env.userprofile;
    return `${home}\\Pictures`;
}

export function listenEvents(eventName: string, callback) {
    const {ipcRenderer} = require('electron')
    ipcRenderer.on(eventName, callback)    
}

import * as files from './server/files.js';

import { createVFolderTags } from './server/files.js';
import { VFile, VFolder } from './server/vfiles.js';

import { remote } from 'electron';

var home = process.env.userprofile
var defaultPicturesFolder = `${home}\\Pictures`

var vfolder: VFolder;

// PUBLIC
export function initVFolder(folder: string, tags: string[]) {
    vfolder = createVFolderTags(folder, tags.concat([null]));
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
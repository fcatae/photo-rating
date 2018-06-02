import * as files from './server/files.js';

import { createVFolder } from './server/files.js';
import { VFile } from './server/vfiles.js';

var vfolder = createVFolder();

// PUBLIC
export function resetVFolder(folder: string) {
    vfolder = createVFolder(folder);
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
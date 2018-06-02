import * as files from './server/files.js';

import { createVFolderTags } from './server/files.js';
import { VFile } from './server/vfiles.js';

var vfolder = createVFolderTags(null, [null]);

// PUBLIC
export function resetVFolder(folder: string, tags: string[]) {
    vfolder = createVFolderTags(folder, tags.concat([null]) );
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
import * as files from './server/files.js';

import { createVFolder } from './server/files.js';
import { VFile } from './server/vfiles.js';

var vfolder = createVFolder();

// // insert images into the queue
// createImageList().map( insertImageIntoQueue );

// PUBLIC
export function resetVFolder(folder: string) {
    vfolder = createVFolder(folder);
}

// export function getPrevImage(): string {
//     var nextV = vfolder.getPrevious();
//     if( nextV == null ) {
//         return null;
//     }
//     return nextV.virtualPath;
// }

// export function getNextImage(): string {
//     var nextV = vfolder.getNext();
//     if( nextV == null ) {
//         return null;
//     }
//     return nextV.virtualPath;
// }

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

// export function approveFile(file: string, tag: string) {
//     var vfile = vfolder.getCurrent();
//     vfolder.changeFileTag(vfile, tag);
//     //vfolder.syncFile(vfile);
//     //return files.approveFile(file, tag);
// }

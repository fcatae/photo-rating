/// <reference types="node"/>
import * as path from 'path';

export class VFolder {
    private _folderPath: string;
    private _fileList: VFile[];

    constructor(fileList: VFile[]) {
        this._fileList = fileList;
    }

    getPrevious() : VFile {
        return null;    
    }
    getCurrent() : VFile {    
        return null;    
    }
    getNext() : VFile {    
        return null;    
    }

    changeFileTag(file: VFile, tag: string) : void {        
    }

    syncFile(file: VFile) : void {        
    }
}

export class VFile {
    id: string;
    filename: string;
    initialPath: string;
    virtualPath: string;
    tag: string;
}

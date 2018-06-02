/// <reference types="node"/>
import * as path from 'path';
import * as fs from 'fs';

export class VFolder {
    private folderPath: string;
    private fileList: VFile[];
    private curFileIdx: number;
    private totalFileIdx: number;
    
    constructor(folderPath: string, fileList: VFile[]) {
        this.folderPath = folderPath;
        this.fileList = fileList;
        this.curFileIdx = -1;
        this.totalFileIdx = fileList.length;
    }

    getPrevious() : VFile {
        this.curFileIdx = (this.curFileIdx >= 0) ? this.curFileIdx - 1 : -1;
        return this.getCurrent();    
    }

    getCurrent() : VFile {
        var isValidIndex = ( this.curFileIdx == -1 || this.curFileIdx >= this.totalFileIdx );
        
        if(isValidIndex) {
            return null;    
        }        
        return this.fileList[this.curFileIdx];
    }

    getNext() : VFile {    
        this.curFileIdx = (this.curFileIdx < this.totalFileIdx) ? this.curFileIdx + 1 : this.totalFileIdx;
        return this.getCurrent();    
    }

    changeFileTag(file: VFile, tag: string) : void {
        var comp1 = this.folderPath;
        var comp2 = tag;
        var comp3 = file.filename;

        var virtualPath = path.join(comp1, comp2, comp3);

        file.virtualPath = virtualPath;
    }

    syncFile(file: VFile) : void {
        fs.renameSync(file.initialPath, file.virtualPath);
        file.initialPath = file.virtualPath;
    }
}

export class VFile {
    id: string;
    filename: string;
    initialPath: string;
    virtualPath: string;
    tag: string;
}

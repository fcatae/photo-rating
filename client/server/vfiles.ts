/// <reference types="node"/>
import * as path from 'path';
import * as fs from 'fs';

export class VFolder {
    private folderPath: string;
    private fileList: VFile[];
    private curFileIdx: number;
    private totalFileIdx: number;
    
    constructor(folderPath: string, fileList: VFile[]) {
        this.fileList = fileList;
        this.folderPath = folderPath;
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
        var newfolder = path.join(this.folderPath, tag);
        file.move(newfolder);
    }

    syncFile(file: VFile) : void {
        file.sync();
    }
}

interface VFileOptions {
    id: number;
    filename: string;
    sourcePath: string;
    tag: string;
}

export class VFile implements VFileOptions {
    id: number;
    filename: string;
    sourcePath: string;
    tag: string;
    private futurePath: string;
    
    constructor(props: VFileOptions) {
        this.id = props.id;
        this.filename = props.filename;
        props.sourcePath = this.sourcePath;
        this.tag = props.tag;
    }

    move(newfolder: string) {        
        var newpath = path.join(newfolder, this.filename);
        this.futurePath = newpath;
    }
    
    sync() : void {
        var file = this;

        if( process.env.PHOTO_RATING_EXECUTABLE == null ){
            return;
        }

        if( file.futurePath == null || file.futurePath == file.sourcePath ) {
            return;
        }

        var folder = path.dirname(file.futurePath);
        if( !fs.existsSync(folder) ) {
            fs.mkdirSync(folder);
        }

        fs.renameSync(file.sourcePath, file.futurePath);
        file.sourcePath = file.futurePath;
    }
}

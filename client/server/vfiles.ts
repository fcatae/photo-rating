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

    public static createTreeFrom(folderName: string, folders: VFolder[]) : VFolder {
        if(folderName == null || folders.length == 0) {
            throw 'invalid arguments';            
        }

        var filelist = flatten(folders.map(vf => vf.fileList));

        var renumeredFilelist = filelist.map( (f,i) => { f.id = i; return f; });

        return new VFolder(folderName, renumeredFilelist);

        // https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays-in-javascript/39000004#39000004
        function flatten(arr) {
            return arr.reduce(function (flat, toFlatten) {
              return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
            }, []);
        }
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
        file.tag = tag;
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
        this.sourcePath = props.sourcePath;
        this.tag = props.tag;
    }

    move(newfolder: string) {        
        var newpath = path.join(newfolder, this.filename);
        this.futurePath = newpath;
    }
    
    sync() : void {
        var file = this;

        // if( process.env.PHOTO_RATING_EXECUTABLE == null ){
        //     return;
        // }

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

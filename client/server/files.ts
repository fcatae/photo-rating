/// <reference types="node"/>

import * as fs from 'fs';
import * as path from 'path';
import { VFolder, VFile } from './vfiles.js'

function enumerateImageFiles(folder: string) : string[] {
    if( !fs.existsSync(folder) ) {
        return [];
    }

    var files = fs
                .readdirSync(folder)
                .map(appendFolderName(folder))
                .map(s => s.toLowerCase())
                .filter(isImage)

    return files;
}

function isNotDirectory(file: string) : boolean {
    var stat = fs.statSync(file);
    return stat.isFile();
}

function isImage(file: string) : boolean {
    return /\.(jpg|jpeg|gif|png)$/.test(file);
}

function appendFolderName(folder: string) {
    return (file: string) => path.join(folder, file);
}

export function createVFolderTags(folderName: string, tags: string[]) : VFolder {
    if(folderName == null) {
        throw "invalid argument: folderName == null"
    }
    var folders = tags.map(t => createVFolder(folderName, t));

    return VFolder.createTreeFrom(folderName, folders);
}

function createVFolder(folderName: string, tag: string) : VFolder {
    var folderTag = path.join(folderName, tag || '');

    var files = enumerateImageFiles(folderTag);

    var vfiles : VFile[] = files.map( (f, i) => { 
        return new VFile({
                    id: i,
                    filename: path.basename(f),
                    sourcePath: f,                    
                    tag: tag
                });            
        });

    return new VFolder(folderName, vfiles);
}

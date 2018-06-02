/// <reference types="node"/>

import * as fs from 'fs';
import * as path from 'path';
import { Z_SYNC_FLUSH } from 'zlib';
import { VFolder, VFile } from './vfiles.js'

var home = process.env.userprofile
var defaultPicturesFolder = `${home}\\Pictures`

function enumerateImageFiles(folder: string) {
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

export function createVFolder(folderName?: string) : VFolder {
    folderName = folderName || defaultPicturesFolder;

    var files = enumerateImageFiles(folderName);

    var vfiles : VFile[] = files.map( (f, i) => { 
        return  {
                    id: i,
                    filename: path.basename(f),
                    sourcePath: f,
                    futurePath: f,
                    tag: null
                }                
        });

    return new VFolder(folderName, vfiles);
}
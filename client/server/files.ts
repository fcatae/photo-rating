/// <reference types="node"/>

import * as fs from 'fs';
import * as path from 'path';
import { Z_SYNC_FLUSH } from 'zlib';
import { VFolder, VFile } from './vfiles.js'

var home = process.env.userprofile
var pics = `${home}\\Pictures`

var files = enumerateImageFiles(pics);          

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
    return (file: string) => folder + '\\' + file;
}

function moveFile(src: string, dest: string) {    
    fs.renameSync(src, dest);
}

export function approveFile(file: string, tag: string) {
    var folder = pics + '\\' + tag;

    if( !fs.existsSync(folder) ) {
        fs.mkdirSync(folder);
    }
    
    var basename = path.parse(file).base;
    var newname = folder + '\\' + basename;

    fs.renameSync(file, newname);
}

export function createImageList() {
    return files;
}

export function createVFolder(folderName: string) : VFolder {
    var files = enumerateImageFiles(folderName);

    var vfiles : VFile[] = files.map( (f, i) => { 
        return  {
                    id: i.toString(16),
                    filename: path.basename(f),
                    initialPath: f,
                    virtualPath: f,
                    tag: null
                }                
        });

    return new VFolder(vfiles);
}
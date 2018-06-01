/// <reference types="node"/>

import * as fs from 'fs';
import * as path from 'path';
import { Z_SYNC_FLUSH } from 'zlib';

var home = process.env.userprofile
var pics = `${home}\\Pictures`

var files = fs
            .readdirSync(pics)
            .map(appendFolderName(pics))
            .map(s => s.toLowerCase())
            .filter(isImage)

files.forEach(f => console.log(f))            

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

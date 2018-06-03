/// <reference path="html_globals.d.ts" />

import * as path from 'path';

import * as interop from './interop.js';
import { VFile } from './server/vfiles.js';
import { start } from 'repl';

interface AppState_Tag {
    name: string;
    image: string;    
}

interface AppState {
    page: string;
    currentFolder: string;
    currentImage: string;
    currentTag: string;
    currentFile: VFile;
    tags: { [id: string] : AppState_Tag };
}

export const START_APP = 'START_APP';
export const CONFIG_UPDATE_TAG = 'CONFIG_UPDATE_TAG';
export const CONFIG_UPDATE_FOLDER = 'CONFIG_UPDATE_FOLDER';
export const SET_IMAGE = 'SET_IMAGE';
export const SET_IMAGE_TAG = 'SET_IMAGE_TAG';
export const SET_IMAGE_FILE = 'SET_IMAGE_FILE';

export function startApp(page: string) {
    return {
        type: START_APP,
        page: page
    };
}

export function configUpdateTag(id: string, name: string) {
    return {
        type: CONFIG_UPDATE_TAG,
        id: id,
        name: name
    };
}

export function configUpdateFolder(folder: string) {
    return {
        type: CONFIG_UPDATE_TAG,
        folder: folder
    };
}

export function setImage(image: string) {
    return {
        type: SET_IMAGE,
        image: image
    };
}

export function setImageTag(tag: string) {
    return {
        type: SET_IMAGE_TAG,
        tag: tag
    };
}

export function setImageFile(file: VFile) {
    return {
        type: SET_IMAGE_FILE,
        file: file
    };
}

const initialState_Tags : { [id: string] : AppState_Tag } = {            
    'SUPERB': { name:'SUPERB', image:'superb.png'}, 
    'GOOD': { name:'GOOD', image:'good.png'}, 
    'BAD': { name:'BAD', image:'bad.png'},
}

const initialState: AppState = {
    page: "config",
    currentFolder: interop.getDefaultPicturesFolder(),
    currentImage: null,
    currentTag: null,
    currentFile: null,
    tags: initialState_Tags
}  

function photoApp(state : AppState = initialState, action) : AppState {       
    return { 
        ...photoApp_File(state, action),
        currentFolder: photoApp_Folder(state.currentFolder, action),
        page: photoApp_Page(state.page, action),
        tags: photoApp_Tags(state.tags, action)
    };
}

function photoApp_Folder(state = interop.getDefaultPicturesFolder(), action) : string {  
    if( action.type == CONFIG_UPDATE_FOLDER ) {
        return action.folder;
    }
    
    return state;
}

function photoApp_Page(state = "config", action) : string {  
    if( action.type == START_APP ) {
        return action.page;
    }

    return state;
}

function photoApp_Tags(state = initialState_Tags, action) {   
    if( action.type == CONFIG_UPDATE_TAG ) {
        var tags = { ...state };
        tags[action.id] = { ...tags[action.id] };
        tags[action.id].name = action.name;  
        return tags; 
    }

    return state;
}

function photoApp_File(state = initialState, action) {    
    if( action.type == SET_IMAGE ) {
        return {
            currentImage: action.image,
            currentTag: state.currentTag,
            currentFile: state.currentFile
        }
    }
    if( action.type == SET_IMAGE_TAG ) {
        return {
            currentImage: state.currentImage,
            currentTag: action.tag,
            currentFile: state.currentFile
        }
    }
    if( action.type == SET_IMAGE_FILE ) {
        return {
            currentImage: (action.file == null) ? null : action.file.virtualPath,
            currentTag: (action.file == null) ? null : action.file.tag,
            currentFile: action.file
        }
    }
    return state;
}

const store = Redux.createStore(photoApp);

store.subscribe( ()=> {
    console.log(JSON.stringify(store.getState()));
});

const mapStateToProps: any = (state: AppState) => {
    return {
        activePage: state.page,
        currentImage: state.currentImage,
        currentTag: state.currentTag,
        tagsConfig: state.tags
    };
}

const mapDispatchToProps: any = (dispatch) => {
    return {
        onStartApp: () => {
            // Init
            var currentFolder = store.getState().currentFolder;
            var tags = store.getState().tags;
            interop.initVFolder(currentFolder, [null, tags['BAD'].name, tags['GOOD'].name, tags['SUPERB'].name ]);

            dispatch(startApp("app"));
        },
        onConfigChange: (id: string) => {
            var currentFolder = store.getState().currentFolder;
            var newfolder = interop.chooseSingleFolder(currentFolder);
            var relativeFolder = path.relative(currentFolder, newfolder);
    
            var validRelativeFolder = relativeFolder[0] != '.';
    
            if( !validRelativeFolder ) {
                alert('invalid path');            
            }
    
            if( newfolder != null && validRelativeFolder) {
                dispatch(configUpdateTag(id, relativeFolder));
            }
            
        },
        onFaceSelected: (id: string) => {

            var file = store.getState().currentFile;

            if( id == ":none") {
                interop.changeTag(file, '');
                dispatch(setImageTag(null))                  
            }

            if( id != null && id[0] == ':' ) {
                var next: VFile;
                if( id.length > 1 && id[1] == '<' ) {
                    next = interop.getPrevImageVFile();
                    dispatch(setImageFile(next))                      
                    if(next!= null) {
                        dispatch(setImage(next.sourcePath))
                        dispatch(setImageTag(next.tag))
                    }
                } else if( id.length > 1 && id[1] == '>' ) {
                    next = interop.getNextImageVFile();
                    dispatch(setImageFile(next))  
                    if(next!= null) {
                        dispatch(setImage(next.sourcePath))
                        dispatch(setImageTag(next.tag))
                    }
                }

                // go back to config
                if(next === null) {
                    dispatch(startApp("config"));
                }

                return;
            }
            
            var tag = id;
            if(id != null && tag[0] != ':' && file != null) {
                interop.changeTag(file, tag);

                var next = interop.getNextImageVFile();
                dispatch(setImageFile(next))  
                if(next!= null) {
                    dispatch(setImage(next.sourcePath))
                    dispatch(setImageTag(next.tag))
                }
            }
        },
        onInit: () => {
            var next = interop.getNextImageVFile();
            dispatch(setImageFile(next))  
            if(next!= null) {
                dispatch(setImage(next.sourcePath))
                dispatch(setImageTag(next.tag))
            }
        }
    };
}

export const ConnectPhotoApp = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
);

export const Store = store;

interop.listenEvents('appReset', (event, args) => {
    store.dispatch(startApp('config'));
});
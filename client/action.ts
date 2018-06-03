/// <reference path="html_globals.d.ts" />

import * as interop from './interop.js';
import { VFile } from './server/vfiles.js';
import { start } from 'repl';

interface AppState_Tag {
    name: string;
    image: string;    
}

interface AppState {
    page: string;
    currentImage: string;
    currentTag: string;
    currentFile: VFile;
    tags: { [id: string] : AppState_Tag };
}

export const START_APP = 'START_APP';
export const SET_IMAGE = 'SET_IMAGE';
export const SET_IMAGE_TAG = 'SET_IMAGE_TAG';
export const SET_IMAGE_FILE = 'SET_IMAGE_FILE';

export function startApp(page: string) {
    return {
        type: START_APP,
        page: page
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
    'SUPERB': { name:'s1', image:'superb.png'}, 
    'GOOD': { name:'g1', image:'good.png'}, 
    'BAD': { name:'b1', image:'bad.png'},
}

const initialState: AppState = {
    page: "config",
    currentImage: null,
    currentTag: null,
    currentFile: null,
    tags: initialState_Tags
}  

function photoApp(state : AppState = initialState, action) : AppState {       
    return { 
        ...photoApp_File(state, action),
        page: photoApp_Page(state.page, action),
        tags: photoApp_Tags(state.tags, action)
    };
}

function photoApp_Page(state = "config", action) : string {  
    if( action.type == START_APP ) {
        return "app";
    }

    return state;
}

function photoApp_Tags(state = initialState_Tags, action) {      
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
            var tags = store.getState().tags;
            interop.initVFolder(null, [null, tags['BAD'].name, tags['GOOD'].name, tags['SUPERB'].name ]);

            dispatch(startApp("app"));
        },
        onFaceSelected: (id: string) => {

            if( id == ":none") {
                dispatch(setImageTag(null))  
            }

            if( id != null && id[0] == ':' ) {
                if( id.length > 1 && id[1] == '<' ) {
                    var next = interop.getPrevImageVFile();
                    dispatch(setImageFile(next))                      
                    if(next!= null) {
                        dispatch(setImage(next.sourcePath))
                        dispatch(setImageTag(next.tag))
                    }
                } else if( id.length > 1 && id[1] == '>' ) {
                    var next = interop.getNextImageVFile();
                    dispatch(setImageFile(next))  
                    if(next!= null) {
                        dispatch(setImage(next.sourcePath))
                        dispatch(setImageTag(next.tag))
                    }
                }
                return;
            }

            var file = store.getState().currentFile;
            
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


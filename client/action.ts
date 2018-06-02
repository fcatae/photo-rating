/// <reference path="html_globals.d.ts" />

import * as interop from './interop.js';
import { VFile } from './server/vfiles.js';

interface AppState {
    currentImage: string;
    currentTag: string;
    currentFile: VFile;
}

export const SET_IMAGE = 'SET_IMAGE';
export const SET_IMAGE_TAG = 'SET_IMAGE_TAG';
export const SET_IMAGE_FILE = 'SET_IMAGE_FILE';

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

const initialState: AppState = {
    currentImage: null,
    currentTag: null,
    currentFile: null
}

function photoApp(state = initialState, action) {    
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
        currentImage: state.currentImage,
        currentTag: state.currentTag
    };
}

const mapDispatchToProps: any = (dispatch) => {
    return {
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

// Init
interop.initVFolder(null, [null, 'BAD', 'GOOD', 'SUPERB']);

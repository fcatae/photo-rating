import { createStore, Dispatch } from 'redux';
import { connect, Provider } from 'react-redux';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './app.js'
import * as interop from './interop.js';
import * as files from './files.js';

interface AppState {
    currentImage: string;
}

export const SET_IMAGE = 'SET_IMAGE';

export function setImage(image: string) {
    return {
        type: SET_IMAGE,
        image: image
    };
}

const initialState: AppState = {
    currentImage: null
}

function photoApp(state = initialState, action) {    
    if( action.type == SET_IMAGE ) {
        return {
            currentImage: action.image
        }
    }

    return state;
}

const store = createStore(photoApp);

store.subscribe( ()=> {
    //console.log(JSON.stringify(store.getState()));
//    alert(JSON.stringify(store.getState()));
});

const mapStateToProps: any = (state: AppState) => {
    return {
        currentImage: state.currentImage
    };
}

const mapDispatchToProps: any = (dispatch: Dispatch<any>) => {
    return {
        onFaceSelected: id => {
            var file = store.getState().currentImage;

            if( file == null )
                return;
            
            if(id != '') {
                //alert(file + ': ' + id)
                files.approveFile(file, id);
            }
            
            var next = interop.getNextImage();
            dispatch(setImage(next))
        },
        onInit: () => {
            console.log('init')
            var next = interop.getNextImage();
            dispatch(setImage(next))
        }
    };
}

export const ConnectPhotoApp = connect(
    mapStateToProps,
    mapDispatchToProps
);

export const Store = store;
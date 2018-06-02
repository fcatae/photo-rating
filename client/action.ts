/// <reference path="html_globals.d.ts" />

import * as interop from './interop.js';

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

const store = Redux.createStore(photoApp);

store.subscribe( ()=> {
    //console.log(JSON.stringify(store.getState()));
//    alert(JSON.stringify(store.getState()));
});

const mapStateToProps: any = (state: AppState) => {
    return {
        currentImage: state.currentImage
    };
}

const mapDispatchToProps: any = (dispatch) => {
    return {
        onFaceSelected: (id: string) => {
            var file = store.getState().currentImage;

            if( id != null && id[0] == ':' ) {
                if( id.length > 1 && id[1] == '<' ) {
                    var next = interop.getPrevImage();
                    dispatch(setImage(next))
                } else if( id.length > 1 && id[1] == '>' ) {
                    var next = interop.getNextImage();
                    dispatch(setImage(next))
                }
                return;
            }

            if(id != null && id[0] != ':' && file != null) {
                interop.approveFile(file, id);

                var next = interop.getNextImage();
                dispatch(setImage(next))
            }
        },
        onInit: () => {
            console.log('init')
            var next = interop.getNextImage();
            dispatch(setImage(next))
        }
    };
}

export const ConnectPhotoApp = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
);

export const Store = store;
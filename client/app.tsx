/// <reference path="html_globals.d.ts" />

import {createVFolder} from './server/files.js';
var vf = createVFolder('c:\\users\\fcatae\\pictures');
console.log(JSON.stringify(vf))
import * as interop from './interop.js';
import * as action from './action.js';

interface AppProps {
    currentImage?: string
    onFaceSelected?: Function
    onInit?: Function
}

export class App extends React.Component<AppProps,{}> {    
    componentDidMount() {
        this.props.onInit();
    }
    render() {
        var curImg = this.props.currentImage;
        
        var mytagsLeft = [ 
            {id:':<', image:'prev.png'}];

        var mytags = [             
            {id:':none1', image:'none.png'},
            {id:'SUPERB', image:'superb.png'}, 
            {id:':none2', image:'none.png'}, 
            {id:'GOOD', image:'good.png'}, 
            {id:'BAD', image:'bad.png'},
            {id:':>', image:'next.png'}];

        return <div className="panelbox">
                    <PanelFaces position="left" tags={mytagsLeft} onFaceSelected={this.props.onFaceSelected}/>
                    <PanelFaces position="right" tags={mytags} onFaceSelected={this.props.onFaceSelected}/>
                    <PanelFullScreen>
                        <ImageBox url={curImg} /> 
                    </PanelFullScreen>
                </div>
   }
}

class PanelFullScreen extends React.Component<{},{}> {
    render() {
        return <div className="panel-fullscreen">{this.props.children}</div>
    }
}

interface PanelFacesProps {
    position?: string,
    tags: ITagFace[],
    onFaceSelected: Function
}

class PanelFaces extends React.Component<PanelFacesProps,{}> {
    render() {        
        var positionRight = { right: 0, bottom: 0 };
        var positionLeft = { left: 0, bottom: 0 };
        
        // very simplistic
        var position = (this.props.position == 'left' ) ? positionLeft : positionRight;

        return <div className="panel-faces" style={position}>{
            this.props.tags.map( face => <TagFace key={face.id} id={face.id} image={face.image} onFaceSelected={this.props.onFaceSelected}/>)
        }</div>
    }
}

interface ITagFace {
    id: string;
    image: string;
}

interface TagFaceProps {
    id: string;
    image: string;
    onFaceSelected: Function
}

class TagFace extends React.Component<TagFaceProps,{}> {
    
    render() {
        var that = this;
        return <div className="facebox"><img className="facebox-img" src={`resources/${that.props.image}`} onClick={() => that.props.onFaceSelected(that.props.id)} /></div>;
    }
}

interface ImageBoxProps {
    url: string;
}

class ImageBox extends React.Component<ImageBoxProps,{}> {
    render() {
        return <div className='imagebox'><img className="imagebox-img" src={this.props.url} /></div>;
    }
}

//ReactDOM.render(<PhoneApp/>, document.getElementById('app'));

var store = action.Store;

var PhotoApp = action.ConnectPhotoApp(App);

ReactDOM.render(<ReactRedux.Provider store={store}>
    <PhotoApp/>
  </ReactRedux.Provider>, document.getElementById('app'));

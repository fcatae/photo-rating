/// <reference path="html_globals.d.ts" />

import * as interop from './interop.js';
import * as action from './action.js';

interface AppProps_Tag {
    id: string;
    name: string;
    image: string; 
}

interface AppProps {
    activePage?: string;
    currentImage?: string
    currentTag?: string
    onConfigChange?: Function,
    onFaceSelected?: Function,
    onStartApp?: Function,
    onInit?: Function
    tagsConfig?: { [id: string] : AppProps_Tag };
}

export class RootPage extends React.Component<AppProps,{}> {
    render() {
        if(this.props.activePage == "app") {
            return <App {...this.props}/>
        }

        return <AppConfig {...this.props}/>
    }
}

export class AppConfig extends React.Component<AppProps,{}> {
    render() {
        var configTags = this.props.tagsConfig;
        var mytags = [             
            {_id: 'SUPERB', id: configTags['SUPERB'].name, image: configTags['SUPERB'].image}, 
            {_id: 'GOOD', id: configTags['GOOD'].name, image: configTags['GOOD'].image}, 
            {_id: 'BAD', id: configTags['BAD'].name, image: configTags['BAD'].image}
        ];

        var nextButton = [{_id:':>', id:':>', image:'next.png'}];

        return <div className="configbox">
            <PanelFacesConfig position="top" tags={mytags} onConfigChange={this.props.onConfigChange} />
            <PanelFaces position="right" tags={nextButton} onFaceSelected={this.props.onStartApp}/>
        </div>    
    }
}

export class App extends React.Component<AppProps,{}> {    
    componentDidMount() {
        this.props.onInit();
    }
    render() {
        var curImg = this.props.currentImage;
        var curTag = this.props.currentTag;
        
        var mytagsLeft = [ 
            {_id:':<', id:':<', image:'prev.png'}];

        var configTags = this.props.tagsConfig;
        var mytags = [             
            {_id: 'SUPERB', id: configTags['SUPERB'].name, image: configTags['SUPERB'].image}, 
            {_id: ':none', id:':none', image:'none.png'}, 
            {_id: 'GOOD', id: configTags['GOOD'].name, image: configTags['GOOD'].image}, 
            {_id: 'BAD', id: configTags['BAD'].name, image: configTags['BAD'].image},
            {_id: ':>', id:':>', image:'next.png'}
        ];

        var mytagsTop = mytags.filter(t => t.id == curTag);        

        return <div className="panelbox">
                    <PanelFaces position="top" tags={mytagsTop} onFaceSelected={function NoAction(){} }/>
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

interface PanelFacesConfigProps {
    position?: string,
    tags: ITagFace[],
    onConfigChange: Function
}

class PanelFacesConfig extends React.Component<PanelFacesConfigProps,{}> {
    render() {        
        var positionTop = { right: '50%', left: '50%', top: 0 };
        var positionRight = { right: 0, bottom: 0 };
        var positionLeft = { left: 0, bottom: 0 };
        
        // default position
        var position : any = positionRight;

        switch(this.props.position) {
            case 'left': position = positionLeft; break;
            case 'top': position = positionTop; break;
            default: position = positionRight; break;
        }

        return <div className="panel-faces-config" style={position}>{
            this.props.tags.map( face => <TagFaceConfig key={face._id} id={face.id} image={face.image} onFaceSelected={() => {this.onConfigChange(face._id)}}/>)
        }</div>
    }

    onConfigChange(id: string) {
        this.props.onConfigChange(id);
    }
}

class PanelFaces extends React.Component<PanelFacesProps,{}> {
    render() {        
        var positionTop = { right: '50%', left: '50%', top: 0 };
        var positionRight = { right: 0, bottom: 0 };
        var positionLeft = { left: 0, bottom: 0 };
        
        // default position
        var position : any = positionRight;

        switch(this.props.position) {
            case 'left': position = positionLeft; break;
            case 'top': position = positionTop; break;
            default: position = positionRight; break;
        }

        return <div className="panel-faces" style={position}>{
            this.props.tags.map( face => <TagFace key={face.id} id={face.id} image={face.image} onFaceSelected={this.props.onFaceSelected}/>)
        }</div>
    }
}

interface ITagFace {
    _id: string;
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

class TagFaceConfig extends React.Component<TagFaceProps,{}> {
    
    render() {
        var props: TagFaceProps = this.props;
        return <div className="facebox-config">
                <img className="facebox-config-img" src={`resources/${props.image}`} />
                <button className="facebox-config-input" onClick={() => props.onFaceSelected(props.id)}>{props.id}</button>
            </div>;
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

var PhotoRootPage = action.ConnectPhotoApp(RootPage);
var PhotoApp = action.ConnectPhotoApp(App);
var PhotoAppConfig = action.ConnectPhotoApp(AppConfig);

ReactDOM.render(<ReactRedux.Provider store={store}>
    <PhotoRootPage/>
  </ReactRedux.Provider>, document.getElementById('app'));

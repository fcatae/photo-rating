import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as interop from './interop.js';

class App extends React.Component<{},{}> {    
   render() {
        var curImg = interop.getNextImage();
        
        var mytags = [{id:'-1', image:'bad.png'}, {id:'1', image:'good.png'}];

        return <div className="panelbox">
                    <PanelFaces tags={mytags}/>
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
    tags: TagFaceProps[]
}

class PanelFaces extends React.Component<PanelFacesProps,{}> {
    render() {        
        var position = {
            right: 0,
            bottom: 0
        };

        return <div className="panel-faces" style={position}>{
            this.props.tags.map( face => <TagFace id={face.id} image={face.image}/>)
        }</div>

        return <div className="panel-faces" style={position}><TagFace id="bad" image="bad.png"/><TagFace id="good" image="good.png"/></div>
    }
}

interface TagFaceProps {
    id: string;
    image: string;
}

class TagFace extends React.Component<TagFaceProps,{}> {
    render() {
        return <div className="facebox"><img className="facebox-img" src={`resources/${this.props.image}`} onClick={()=>alert(this.props.id)} /></div>;
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

ReactDOM.render(<App/>, document.getElementById('app'));

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as interop from './interop.js';

class App extends React.Component<{},{}> {    
   render() {
        var imgList = interop.getImageList();

        return <div className="panelbox">
                    <PanelFaces/>
                    {imgList.map( (img, i) =>
                        <ImageBox key={i} url={img} onClick={()=>alert(i)} />
                    )} 
                </div>
        
   }
}

interface ImageBoxProps {
    url: string;
    onClick: any;
}

class PanelFaces extends React.Component<{},{}> {
    render() {        
        var position = {
            right: 0,
            bottom: 0
        };
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

class ImageBox extends React.Component<ImageBoxProps,{}> {
    render() {
        return <div className='imagebox'><img className="imagebox-img" src={this.props.url} onClick={this.props.onClick} /></div>;
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));

var count = interop.getImageList().length;
console.log('image count += ' + count);

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as interop from './interop.js';

class App extends React.Component<{},{}> {    
   render() {
        var imgList = interop.getImageList();

        return imgList.map( (img, i) =>
            <ImageBox key={i} url={img} onClick={()=>alert(i)} />
        );
   }
}

interface ImageBoxProps {
    url: string;
    onClick: any;
}

class ImageBox extends React.Component<ImageBoxProps,{}> {
    render() {
        return <div className='imagebox'><img className="imagebox-img" src={this.props.url} onClick={this.props.onClick} /></div>;
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));

var count = interop.getImageList().length;
console.log('image count += ' + count);

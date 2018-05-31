import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as interop from './interop.js';

class App extends React.Component<{},{}> {    
   render() {
       return <div>Hello World!</div>;
   }
}

ReactDOM.render(<App/>, document.getElementById('app'));

var count = interop.getImageList().length;
console.log('image count += ' + count);

/*global chrome*/
/*global $*/
/* src/index.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import Extractor from "./Extractor.js"
import Injestor from "./injestor/components/Injestor.js";
import Dialog from 'react-dialog';

class Main extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        injestorInput: null
      }
    }

    render() {
        return (
          <Dialog
            width={1200}
            height={700}
            isDraggable={true}
            isResizable={true}
            title={"Data Demonstration"}
            id={"dialog-kg"}
          >
          <div id={"my-extension-root"}>
            <Frame id="frame-kg" head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>]}>
               <FrameContextConsumer>
               {({document, window}) => {
                   const {injestorInput} = this.state
                   if(injestorInput === null) {
                     return <Extractor
                             document={document}
                             window={window}
                             onTableUpload={(table) => {
                               this.setState({injestorInput: table})
                             }}/>
                   } else {
                     return <Injestor
                             rawTableData={injestorInput}
                             document={document}
                             window={window}
                             />
                   }
                }}
                </FrameContextConsumer>
            </Frame>
            </div>
          </Dialog>
        )
    }
}

const app = document.createElement('div');
app.id = "dialog-wrap";
document.body.insertBefore(app, document.body.lastChild.nextSibling);
ReactDOM.render(<Main />, app);
app.style.display = "none";
app.style.width = "0px";
app.style.height = "0px";



chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action") {
        toggle();
      }
   }
);

function toggle(){
   if(app.style.display === "none"){
     app.style.display = "block"
   }else{
     app.style.display = "none"
   }
}

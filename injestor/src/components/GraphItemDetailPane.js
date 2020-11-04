import React from "react";
import GraphItemAutoComplete from "./GraphItemAutoComplete.js"

export default class GraphItemDetailPane extends React.Component {

  render() {
    const { canvasWidth, canvasHeight, onRemove, focusType, onSelect } = this.props;
    const graphItemDetailPaneStype = {
      margin:`${canvasHeight/100*25}px 10px 10px 10px`,
      float:"left", "backgroundColor":"NavajoWhite",
      width:canvasWidth/2.3,
      height:canvasHeight/100*70,
      "borderRadius": "8px",
      "boxShadow": "5px 5px 5px grey"
    };
    return (
      <div id="GraphItemDetailPane" style={graphItemDetailPaneStype}>
          <button onClick={onRemove}>Remove</button>
          {focusType === "Literal" || <GraphItemAutoComplete searchType={focusType} onSelect={onSelect}/>}
      </div>
    );
  }
}

import React from "react";
import { SubGraphEditor } from "./SubGraphEditor.js";
import { DataTable } from "./DataTable.js";
import Connection from "../graph/Connection.js";

export default class Injestor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subGraphEditRow: undefined,
      subGraphEdits: props.rawTableData.slice(1).map((row) => {return {};})
    };
    this.onRowSelect = this.onRowSelect.bind(this);
    this.onSubGraphSave = this.onSubGraphSave.bind(this);
    this.onUpload = this.onUpload.bind(this);
  }

  onRowSelect(rowNumber) {
    this.setState({subGraphEditRow: rowNumber});
  }

  onSubGraphSave(subgraph) {
    this.setState((state) => {
      const subGraphEditsUpdated = [...state.subGraphEdits];
      subGraphEditsUpdated[state.subGraphEditRow] = subgraph;
      return {
        subGraphEditRow: undefined,
        subGraphEdits: subGraphEditsUpdated
      };
    });
  }

  printGraphTriples(subgraph) {
    Object.values(subgraph).filter((graphItem) => graphItem instanceof Connection).
      map((item) => console.log(item.getTripleData()));
  }

  onUpload() {
    this.state.subGraphEdits.map(this.printGraphTriples);
  }

  render() {
    const { rawTableData } = this.props;
    const { subGraphEditRow, subGraphEdits } = this.state;
    return subGraphEditRow === undefined ?
      <div>
        <DataTable data={rawTableData} selectedRow={this.onRowSelect}/>
        <button onClick={this.onUpload}>Upload</button>
      </div> :
      <SubGraphEditor
        initialSubgraph={subGraphEdits[subGraphEditRow]}
        rowHeaders={rawTableData[0]}
        rowData={rawTableData[subGraphEditRow]}
        onSave={this.onSubGraphSave}
      />;
  }
}

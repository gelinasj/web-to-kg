import React from "react";
import { SubGraphEditor } from "./SubGraphEditor.js";
import { DataTable } from "./DataTable.js";

export default class Injestor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subGraphEditRow: undefined,
      subGraphEdits: props.rawTableData.map((row) => {return {};})
    };
    this.onRowSelect = this.onRowSelect.bind(this);
    this.onSubGraphSave = this.onSubGraphSave.bind(this);
  }

  onRowSelect(rowNumber) {
    this.setState({subGraphEditRow: rowNumber});
  }

  onSubGraphSave() {
    this.setState({subGraphEditRow: undefined});
  }

  render() {
    const { rawTableData } = this.props;
    const { subGraphEditRow } = this.state;
    return subGraphEditRow === undefined ?
      <DataTable data={rawTableData} selectedRow={this.onRowSelect}/> :
      <SubGraphEditor rowHeaders={rawTableData[0]} rowData={rawTableData[subGraphEditRow]} onSave={this.onSubGraphSave}/>;
  }
}

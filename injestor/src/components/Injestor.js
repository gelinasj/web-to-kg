import React from "react";
import { SubGraphEditor } from "./SubGraphEditor.js";
import { DataTable } from "./DataTable.js";
import Connection from "../graph/Connection.js";
import { cloneSubgraph } from "../auxillary/auxillary.js";

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
    this.generalize = this.generalize.bind(this);
  }

  generalize() {
    const subGraphEditsUpdated = [...this.state.subGraphEdits];
    let generalizePromise = Promise.resolve();
    subGraphEditsUpdated.forEach((subgraph, index) => {
      Object.values(subgraph).forEach((graphItem) => {
        generalizePromise = generalizePromise.then(() => {
          return graphItem.generalize(this.props.rawTableData[index + 1]);
        });
      });
    });
    generalizePromise.then(() => {
      this.setState({subGraphEdits: subGraphEditsUpdated});
    });
  }

  onRowSelect(rowNumber, event) {
    if(event === "onEdit") {
      this.setState({subGraphEditRow: rowNumber});
    } else if (event === "onGeneralize") {
      this.setState((state) => {
        const graphToGeneralize = state.subGraphEdits[rowNumber - 1];
        return {
          subGraphEdits: state.subGraphEdits.map((subgraph, index) => {
            if(index + 1 === rowNumber) {
              return graphToGeneralize;
            } else {
              return cloneSubgraph(graphToGeneralize);
            }
          })
        };
      }, this.generalize);
    }
  }

  onSubGraphSave(subgraph) {
    this.setState((state) => {
      const subGraphEditsUpdated = [...state.subGraphEdits];
      subGraphEditsUpdated[state.subGraphEditRow - 1] = subgraph;
      return {
        subGraphEditRow: undefined,
        subGraphEdits: subGraphEditsUpdated
      };
    });
  }

  printGraphTriples(subgraph) {
    Object.values(subgraph).filter(
      (graphItem) => graphItem instanceof Connection
    ).map(
      (item) => console.log(item.getTripleData())
    );
  }

  onUpload() {
    this.state.subGraphEdits.map(this.printGraphTriples);
  }

  render() {
    const { rawTableData } = this.props;
    const { subGraphEditRow, subGraphEdits } = this.state;
    return subGraphEditRow === undefined ?
      <div>
        <DataTable
          data={rawTableData}
          onRowSelect={this.onRowSelect}
          rowEvents={[["Edit Sub-Graph", "onEdit"], ["Generalize Row", "onGeneralize"]]}
        />
        <button onClick={this.onUpload}>Upload</button>
      </div> :
      <SubGraphEditor
        initialSubgraph={subGraphEdits[subGraphEditRow - 1]}
        rowHeaders={rawTableData[0]}
        rowData={rawTableData[subGraphEditRow]}
        onSave={this.onSubGraphSave}
      />;
  }
}

import React from "react";
import { SubGraphEditor } from "./SubGraphEditor.js";
import { DataTable } from "./DataTable.js";
import Connection from "../graph/Connection.js";
import Entity from "../graph/Entity.js";
import { cloneSubgraph, getOrCreate } from "../auxillary/auxillary.js";
import { getEntities } from "../auxillary/autocomplete.js";

export default class Injestor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subGraphEditRow: undefined,
      subGraphEdits: props.rawTableData.slice(1).map((row) => {return {};}),
      foundSimilarities: undefined
    };
    this.onRowSelect = this.onRowSelect.bind(this);
    this.onSubGraphSave = this.onSubGraphSave.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.generalize = this.generalize.bind(this);
    this.findSimilarities = this.findSimilarities.bind(this);
  }

  findSimilarities() {
    let entitiesToBindings = {};
    this.state.subGraphEdits.forEach((subgraph) => {
      Object.values(subgraph).forEach((entity) => {
        const boundColumns = Object.keys(entity.bindings);
        if(entity instanceof Entity && boundColumns.length > 0 && entity.kgInfo !== null) {
          const entityId = entity.kgInfo.id;
          let alreadyBound = getOrCreate(entitiesToBindings, entityId, []);
          entitiesToBindings[entityId] = alreadyBound.concat(boundColumns);
        }
      });
    });

    getEntities(Object.keys(entitiesToBindings)).then((entities) => {
      const t1 = performance.now();
      let bindingToPropertyToValueToCount = {};
      Object.entries(entities).forEach(([id, entity]) => {
        const bindings = entitiesToBindings[id];
        Object.entries(entity.claims).forEach(([property, values]) => {
          bindings.forEach((binding) => {
            let propertyToValueToCount = getOrCreate(bindingToPropertyToValueToCount, binding, {});
            let valueToCount = getOrCreate(propertyToValueToCount, property, {});
            values.forEach((value) => {
              getOrCreate(valueToCount, value, 0);
              valueToCount[value] += 1;
            });
          });
        });
      });
      const iterations = Object.values(bindingToPropertyToValueToCount).map(
        Object.values).flat().map(Object.values).flat().reduce((acc, curr) => acc + curr);
      console.log(`Similarity finder iteration count: ${iterations}`);
      const foundSimilarities = {};
      Object.entries(bindingToPropertyToValueToCount).forEach(([binding, propertyToValueToCount]) => {
        foundSimilarities[binding] = Object.entries(
          propertyToValueToCount).map(([property, valueToCount]) => {
            return Object.entries(valueToCount).map(([value, count]) => {
              return [property, value, count];
            });
        }).flat();
        foundSimilarities[binding].sort(([p1,v1,c1],[p2,v2,c2]) => c2 - c1);
        foundSimilarities[binding] = foundSimilarities[binding].slice(0, 4)
      });
      const ids = [];
      const similaritiesPromise = Object.entries(foundSimilarities)
      .forEach(([binding, similarities]) => {
        similarities.forEach(([prop,val,count]) => {
          if(prop.includes("P")) {
            ids.push(prop);
          }
          if(val.includes("Q")) {
            ids.push(val);
          }
        });
      });

      getEntities(ids).then((idToEntityMap) => {
        const readableSimilarityMap = {};
        Object.entries(foundSimilarities)
        .forEach(([binding, similarities]) => {
          readableSimilarityMap[binding] =
          similarities.map(([prop,val,count]) => {
            const propObj = idToEntityMap[prop];
            const valObj = idToEntityMap[val];
            const propPair = propObj === undefined ? [prop, prop] : [prop, propObj.labels.en];
            const valPair = valObj === undefined ? [val, val] : [val, valObj.labels.en];
            return [propPair, valPair, count];
          });
        });
        this.setState({foundSimilarities: readableSimilarityMap});
        const t2 = performance.now();
        console.log(`Time to sanitize entity similarity info: ${(t2-t1)/1000} sec`);
      })
    });
  }

  generalize() {
    const subGraphEditsUpdated = [...this.state.subGraphEdits];
    let generalizePromise = [];
    subGraphEditsUpdated.forEach((subgraph, index) => {
      generalizePromise = Object.values(subgraph).map((graphItem) => {
        return graphItem.generalize(this.props.rawTableData[index + 1]);
      }).concat(generalizePromise);
    });
    Promise.all(generalizePromise).then(() => {
      this.setState({subGraphEdits: subGraphEditsUpdated}, this.findSimilarities);
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

  getFilters() {
    const { foundSimilarities } = this.state;
    if (foundSimilarities === undefined) {
      return undefined;
    }
    const filters = {};
    Object.entries(foundSimilarities).forEach(([binding, similarities]) => {
      filters[binding] = similarities.map(([[pid,p], [vid,v], c], index) => {
        return {
          name: `${p}: ${v}`,
          value: [pid, vid, c]
        }
      })
    });
    return filters;
  }

  render() {
    const { rawTableData } = this.props;
    const { subGraphEditRow, subGraphEdits } = this.state;
    if (subGraphEditRow === undefined) {
      return (
        <div>
          <DataTable
            data={rawTableData}
            onRowSelect={this.onRowSelect}
            rowEvents={[["Edit Sub-Graph", "onEdit"], ["Generalize Row", "onGeneralize"]]}
            filters={this.getFilters()}
          />
          <button onClick={this.onUpload}>Upload</button>
        </div>
      );
    } else {
      return (
        <SubGraphEditor
          initialSubgraph={subGraphEdits[subGraphEditRow - 1]}
          rowHeaders={rawTableData[0]}
          rowData={rawTableData[subGraphEditRow]}
          onSave={this.onSubGraphSave}
        />
      );
    }
  }
}

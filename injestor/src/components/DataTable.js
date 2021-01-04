import React from "react";
import Table from 'react-bootstrap/Table';
import { Multiselect } from 'multiselect-react-dropdown';
import "../auxillary/style.css";

export class DataTable extends React.Component {

  getHeaders(headers) {
    return headers.map((header, index) => <th key={index}>{header}</th>);
  }

  getRow(row) {
    return row.map((cell, index) => <td key={index}>{cell}</td>);
  }

  getBody(rows) {
    const { onRowSelect, rowEvents, filters } = this.props;
    const body = rows.map((row, index) => {
      return (
        <tr key={index+1}>
          {this.getRow(row)}
          {rowEvents.map(([name, id]) => {
            return <td key={id}><button onClick={() => onRowSelect(index+1, id)}>{name}</button></td>;
          })}
        </tr>
      );
    });
    if(filters !== undefined) {
      const filterRow = (
        <tr key={"filter"}>
          {rows[0].map((unusedVar, index) => {
            return (
              <td key={index}>
               {(filters[index] === undefined) ?
                 undefined :
                 <Multiselect
                   id={index}
                   placeholder="Filters"
                   options={filters[index].all} // Options to display in the dropdown
                   onSelect={filters[index].onSelect} // Function will trigger on select event
                   onRemove={filters[index].onRemove} // Function will trigger on remove event
                   selectedValues={filters[index].selected}
                   displayValue="name" // Property name to display in the dropdown options
                 />
               }
              </td>
            );
          })}
        </tr>);
        body.unshift(filterRow);
    }
    return body;
  }

  render() {
    const { data } = this.props;
    return (
      <Table className="styled-table">
        <thead>
          <tr>{this.getHeaders(data[0])}</tr>
        </thead>
        <tbody>{this.getBody(data.slice(1))}</tbody>
      </Table>
    );
  }
}

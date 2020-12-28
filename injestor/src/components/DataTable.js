import React from "react";
import Table from 'react-bootstrap/Table';
import "../auxillary/style.css";

export class DataTable extends React.Component {

  getHeaders(headers) {
    return headers.map((header, index) => <th key={index}>{header}</th>);
  }

  getRow(row) {
    return row.map((cell, index) => <td key={index}>{cell}</td>);
  }

  getBody(rows) {
    const { onRowSelect, rowEvents } = this.props;
    return rows.map((row, index) => {
      return (
        <tr key={index+1}>
          {this.getRow(row)}
          {rowEvents.map(([name, id]) => {
            return <td key={id}><button onClick={() => onRowSelect(index+1, id)}>{name}</button></td>;
          })}
        </tr>
      );
    });
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

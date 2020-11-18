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
    const { selectedRow } = this.props;
    return rows.map((row, index) => {
      return (
        <tr key={index+1}>
          {this.getRow(row)}
          <td><button onClick={() => selectedRow(index+1)}>Edit Sub-Graph</button></td>
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

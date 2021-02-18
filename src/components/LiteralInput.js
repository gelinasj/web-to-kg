import React from "react";
import DatePicker from "react-datepicker";
import GraphItemAutoComplete from "./GraphItemAutoComplete.js";
import "react-datepicker/dist/react-datepicker.css";

export const INPUT_TYPES = {
  string: "String",
  quantity: "Quantity",
  date: "Date",
  url: "URL"
}

export default class LiteralInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      literalInputType:INPUT_TYPES.string,
      value: undefined
    };
    this.onLiteralInputTypeChange = this.onLiteralInputTypeChange.bind(this);
  }

  onLiteralInputTypeChange(value) {
    this.setState({literalInputType:value.target.value})
  }

  getInputForm() {
    const { onChange } = this.props;
    const onChangeDate = (v) => {
      this.setState((state) => {
        const newState = {literalInputType: state.literalInputType, value:v};
        onChange(newState);
        return newState;
      });
    };
    const onChangeString = (v) => {
      v = v.target.value
      this.setState((state) => {
        const newState = {literalInputType: state.literalInputType, value:v};
        onChange(newState);
        return newState;
      });
    };
    const onChangeQuantityData = (v) => {
      const data = v.target.value
      this.setState((state) => {
        const value = {type: "data", value: data};
        const newState = {literalInputType: state.literalInputType, value: value};
        onChange(newState);
        return newState;
      });
    };
    const onChangeQuantityUnit = (v) => {
      this.setState((state) => {
        const value = {type: "unit", value: v};
        const newState = {literalInputType: state.literalInputType, value: value};
        onChange(newState);
        return newState;
      });
    }
    switch(this.state.literalInputType) {
      case INPUT_TYPES.string:
        return <input type="text" name="string" onChange={onChangeString}/>;
      case INPUT_TYPES.quantity:
        return (
          <div>
            <input type="text" name="quantity" onChange={onChangeQuantityData}/> <br/>
            <GraphItemAutoComplete searchType={"Unit"} onSelect={onChangeQuantityUnit}/>
          </div>
        );
      case INPUT_TYPES.date:
        return <DatePicker onChange={onChangeDate}/>;
      case INPUT_TYPES.url:
      return <input type="text" name="url" onChange={onChangeString}/>;
      default: return;
    }
  }

  render() {
    return (
      <div>
        <br/>
        <select onChange={this.onLiteralInputTypeChange} name="LiteralInputType" id="LiteralInputType">
          <option value={INPUT_TYPES.string}>String</option>
          <option value={INPUT_TYPES.quantity}>Quantity</option>
          <option value={INPUT_TYPES.date}>Date</option>
          <option value={INPUT_TYPES.url}>URL</option>
        </select>
        <br/>
        {this.getInputForm()}
      </div>
    );
  }
}

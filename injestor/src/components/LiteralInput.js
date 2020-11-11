import React from "react";
import DatePicker from "react-datepicker";
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
      literalInputType:INPUT_TYPES.string
    };
    this.onLiteralInputTypeChange = this.onLiteralInputTypeChange.bind(this);
  }

  onLiteralInputTypeChange(value) {
    this.setState({literalInputType:value.target.value})
  }

  getInputForm() {
    const { onChange } = this.props;
    const onChangeDefault = (v) => {
      this.setState((state) => {
        onChange({literalInputType: state.literalInputType, value:v})
      });
    };
    const onChangeString = (v) => {
      v = v.target.value
      this.setState((state) => {
        onChange({literalInputType: state.literalInputType, value:v})
      });
    };
    switch(this.state.literalInputType) {
      case INPUT_TYPES.string:
        return <input type="text" name="string" onChange={onChangeString}/>;
      case INPUT_TYPES.quantity:
        return <input type="text" name="quantity" onChange={onChangeString}/>;
      case INPUT_TYPES.date:
        return <DatePicker onChange={onChangeDefault}/>;
      case INPUT_TYPES.url:
      return <input type="text" name="url" onChange={onChangeString}/>;
      default:
        return;
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

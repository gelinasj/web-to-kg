import React from 'react';

class DropdownItem extends React.Component {

    constructor(props) {
        super(props);
    }

    onChange(e) {
        console.log("OPTION", e);
    }

    render() {
        const { value } = this.props;
        return (
            <div id="DropdownItem">
                <option value={value} onChange={this.onChange.bind(this)}>{value}</option>
            </div>
        );
    }
}

export default DropdownItem;

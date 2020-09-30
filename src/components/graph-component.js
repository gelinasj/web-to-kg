import React from 'react';
import SearchBar from "./search-bar.js";

class GraphComponent extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const { id, onChange } = this.props;
        onChange(id, e);
    }

    render() {
        const { type, value } = this.props;
        return (
            <div id="GraphComponent" style={{border: "solid"}}>
                <h3>{type}</h3>
                <SearchBar value={value} onChange={this.handleChange} />
            </div>
        );
    }
}

export default GraphComponent;

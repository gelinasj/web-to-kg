import React from 'react';
import DropdownItem from "./dropdown-item.js";
import { requestDataFunc, processReceivedDataFunc } from "../auxillary/graph-search.js";

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {matches: []}
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        console.log("Before");
        requestDataFunc(e.target.value, (data) => {
            const matches = processReceivedDataFunc(data);
            this.setState({matches});
        });
        console.log("MATCHES", this.state.matches);
        this.props.onChange(e);
    }

    render() {
        const { value } = this.props;
        const { matches } = this.state;
        return (
            <div id="SearchBar">

                <input type="search" value={value} list="Dropdown" onChange={this.handleChange} autocomplete="off" />
                <datalist id="Dropdown">
                    {matches.map(
                        (match) => (<DropdownItem
                                    key={match}
                                    value={match}
                                    />)
                    )}
                </datalist>
            </div>
        );
    }
}

export default SearchBar;
